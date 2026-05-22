import { useReducer } from 'react';

/**
 * RT11 Lifecycle Statuses
 * Defined based on transaction flow and system requirements.
 */
export type RT11Status = 
  | 'IDLE' 
  | 'API_SCORE_READY'
  | 'PAYOUT_PREVIEW_READY'
  | 'TX_BLOCKED' 
  | 'TX_SIGNING' 
  | 'TX_SUBMITTED' 
  | 'TX_CONFIRMED' 
  | 'TX_FAILED';

export type RT11Action = 
  | { type: 'API_SCORE_READY' }
  | { type: 'PAYOUT_PREVIEW_READY' }
  | { type: 'TX_BLOCKED'; reason: string }
  | { type: 'TX_SIGNING' }
  | { type: 'TX_SUBMITTED'; hash: string }
  | { type: 'TX_CONFIRMED' }
  | { type: 'TX_FAILED'; error: string }
  | { type: 'RESET' };

/**
 * Defines valid transitions for the RT11 lifecycle.
 */
const VALID_TRANSITIONS: Record<RT11Status, RT11Status[]> = {
  IDLE: ['API_SCORE_READY', 'TX_BLOCKED', 'TX_SIGNING'],
  API_SCORE_READY: ['PAYOUT_PREVIEW_READY', 'TX_BLOCKED', 'IDLE'],
  PAYOUT_PREVIEW_READY: ['TX_SIGNING', 'TX_BLOCKED', 'IDLE'],
  TX_BLOCKED: ['IDLE', 'TX_SIGNING', 'API_SCORE_READY'],
  TX_SIGNING: ['TX_SUBMITTED', 'TX_FAILED', 'IDLE'],
  TX_SUBMITTED: ['TX_CONFIRMED', 'TX_FAILED'],
  TX_CONFIRMED: ['IDLE', 'API_SCORE_READY'],
  TX_FAILED: ['IDLE', 'TX_SIGNING', 'API_SCORE_READY'],
};

/**
 * Enforces valid state transitions for the RT11 lifecycle.
 */
export function assertValidRT11Transition(prev: RT11Status, next: RT11Status) {
  if (!VALID_TRANSITIONS[prev].includes(next)) {
    throw new Error(`RT11 invalid state transition: ${prev} → ${next}`);
  }
}

export type RT11State = {
  status: RT11Status;
  txHash?: string;
  error?: string;
};

/**
 * RT11 state reducer with transition validation.
 */
function rt11Reducer(state: RT11State, action: RT11Action): RT11State {
  let nextStatus: RT11Status = state.status;

  switch (action.type) {
    case 'API_SCORE_READY': nextStatus = 'API_SCORE_READY'; break;
    case 'PAYOUT_PREVIEW_READY': nextStatus = 'PAYOUT_PREVIEW_READY'; break;
    case 'TX_BLOCKED': nextStatus = 'TX_BLOCKED'; break;
    case 'TX_SIGNING': nextStatus = 'TX_SIGNING'; break;
    case 'TX_SUBMITTED': nextStatus = 'TX_SUBMITTED'; break;
    case 'TX_CONFIRMED': nextStatus = 'TX_CONFIRMED'; break;
    case 'TX_FAILED': nextStatus = 'TX_FAILED'; break;
    case 'RESET': nextStatus = 'IDLE'; break;
  }

  // Enforce transition validation before state update
  assertValidRT11Transition(state.status, nextStatus);

  switch (action.type) {
    case 'API_SCORE_READY': return { status: 'API_SCORE_READY' };
    case 'PAYOUT_PREVIEW_READY': return { status: 'PAYOUT_PREVIEW_READY' };
    case 'TX_BLOCKED': return { status: 'TX_BLOCKED', error: action.reason };
    case 'TX_SIGNING': return { status: 'TX_SIGNING' };
    case 'TX_SUBMITTED': return { status: 'TX_SUBMITTED', txHash: action.hash };
    case 'TX_CONFIRMED': return { ...state, status: 'TX_CONFIRMED' };
    case 'TX_FAILED': return { status: 'TX_FAILED', error: action.error };
    case 'RESET': return { status: 'IDLE' };
    default: return state;
  }
}

export function useRT11State() {
  return useReducer(rt11Reducer, { status: 'IDLE' });
}
