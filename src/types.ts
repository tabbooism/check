export enum DepositStatus {
  IDLE = 'IDLE',
  CAPTURING_FRONT = 'CAPTURING_FRONT',
  CAPTURING_BACK = 'CAPTURING_BACK',
  ANALYZING = 'ANALYZING',
  REVIEW = 'REVIEW',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface CheckMetadata {
  routingNumber: string;
  accountNumber: string;
  checkNumber: string;
  amount: number;
  legalAmountText: string;
  payee: string;
  date: string;
  signatureVerified: boolean;
  endorsementDetected: boolean;
  duplicateDetected: boolean;
}

export interface DepositSession {
  id: string;
  status: DepositStatus;
  frontImage?: string;
  backImage?: string;
  metadata?: CheckMetadata;
  error?: string;
}
