@description('Deployment location')
param location string = resourceGroup().location

@description('Environment name, e.g. demo, pilot, prod')
param environment string = 'pilot'

@description('Allowed tenant IDs as comma-separated string')
param ztbAllowedTenants string

@secure()
@description('ZTB gateway HMAC secret')
param ztbSecret string

@secure()
@description('Operator action signing secret')
param ztbOperatorSecret string

var namePrefix = 'rt91-${environment}'

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${namePrefix}-kv'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enablePurgeProtection: true
    enableSoftDelete: true
  }
}

resource secretGateway 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'ZTB-SECRET'
  properties: {
    value: ztbSecret
  }
}

resource secretOperator 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'ZTB-OPERATOR-SECRET'
  properties: {
    value: ztbOperatorSecret
  }
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${namePrefix}-law'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: replace('${namePrefix}worm${uniqueString(resourceGroup().id)}', '-', '')
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

resource wormContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: '${storage.name}/default/worm-audit'
  properties: {
    publicAccess: 'None'
    immutableStorageWithVersioning: {
      enabled: true
    }
  }
}

resource redis 'Microsoft.Cache/Redis@2023-08-01' = {
  name: '${namePrefix}-redis'
  location: location
  properties: {
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 0
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${namePrefix}-appi'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource appPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '${namePrefix}-plan'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: '${namePrefix}-gateway'
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appPlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        { name: 'ZTB_SECRET'; value: '@Microsoft.KeyVault(SecretUri=${secretGateway.properties.secretUri})' }
        { name: 'ZTB_OPERATOR_SECRET'; value: '@Microsoft.KeyVault(SecretUri=${secretOperator.properties.secretUri})' }
        { name: 'ZTB_ALLOWED_TENANTS'; value: ztbAllowedTenants }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'; value: appInsights.properties.ConnectionString }
        { name: 'WORM_STORAGE_ACCOUNT'; value: storage.name }
        { name: 'WORM_CONTAINER'; value: 'worm-audit' }
        { name: 'REDIS_HOST'; value: redis.properties.hostName }
      ]
    }
  }
}

resource apim 'Microsoft.ApiManagement/service@2023-09-01-preview' = {
  name: '${namePrefix}-apim'
  location: location
  sku: {
    name: 'Developer'
    capacity: 1
  }
  properties: {
    publisherEmail: 'operator@example.com'
    publisherName: 'RT9.1 Resonance Engine'
  }
}

output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output keyVaultName string = kv.name
output storageAccountName string = storage.name
output redisHost string = redis.properties.hostName
output apiManagementName string = apim.name
