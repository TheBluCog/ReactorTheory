export type Agent = { name:string; role:string; E:number; I:number; C:number; D:number; impact:number; entropy:number }

export const agents: Agent[] = [
  { name:'MediatorNode', role:'Calms a conflict', E:5.5, I:.93, C:.92, D:.30, impact:1.7, entropy:.45 },
  { name:'SafetyNode', role:'Checks AI output for risk', E:7.5, I:.90, C:.86, D:.50, impact:2.0, entropy:.65 },
  { name:'TeacherNode', role:'Makes safe learning material', E:7.0, I:.92, C:.88, D:.45, impact:1.4, entropy:.60 },
  { name:'BuilderNode', role:'Builds a useful public tool', E:8.0, I:.82, C:.80, D:.70, impact:1.8, entropy:.80 },
  { name:'SpamNode', role:'Uses AI to spam or mislead', E:8.5, I:.35, C:.30, D:2.50, impact:.55, entropy:2.20 },
]

export const uap = (a:Agent) => (a.E*a.I*a.C)/Math.max(a.D,.0001)
export const resonance = (a:Agent) => ((a.E*a.I*a.C)*a.impact)/Math.max(a.D*a.entropy,.0001)
export const clamp = (n:number,min:number,max:number)=>Math.max(min,Math.min(max,n))
