import { BLOCKCHAIN_NAME } from '../../../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';

export const EVO_ADDRESSES = {
  [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: '0x3247554b2bad31d5120b98d5f51df5a406d6b524',
  [BLOCKCHAIN_NAME.POLYGON]: '0xBCA17c85F7E965ae6f5D05769D300e59221CF1e2'
};

export const EVO_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: true, internalType: 'uint8', name: 'dstFrom', type: 'uint8' }
    ],
    name: 'OrderCompleted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint8', name: 'decimals', type: 'uint8' },
          { internalType: 'uint8', name: 'destination', type: 'uint8' }
        ],
        indexed: false,
        internalType: 'struct Bridge.Order',
        name: 'order',
        type: 'tuple'
      },
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' }
    ],
    name: 'OrderCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: '_isTrusted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'addTrusted',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'orderId', type: 'uint256' }],
    name: 'close',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orderId', type: 'uint256' },
      { internalType: 'uint8', name: 'dstFrom', type: 'uint8' },
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'address payable', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'decimals', type: 'uint256' }
    ],
    name: 'completeOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'completed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint8', name: 'destination', type: 'uint8' },
      { internalType: 'address', name: 'target', type: 'address' }
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orderId', type: 'uint256' },
      { internalType: 'uint8', name: 'dstFrom', type: 'uint8' }
    ],
    name: 'isCompleted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'listOrders',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint8', name: 'decimals', type: 'uint8' },
          { internalType: 'uint8', name: 'destination', type: 'uint8' }
        ],
        internalType: 'struct Bridge.Order[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'listTokensNames',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'orders',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint8', name: 'decimals', type: 'uint8' },
      { internalType: 'uint8', name: 'destination', type: 'uint8' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'removeTrusted',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'uint256', name: 'bonus', type: 'uint256' }
    ],
    name: 'setBonus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'uint256', name: 'dailyLimit', type: 'uint256' },
      { internalType: 'uint8', name: 'inputDecimals', type: 'uint8' }
    ],
    name: 'setDailyLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' }
    ],
    name: 'setFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'uint256', name: 'feeBase', type: 'uint256' },
      { internalType: 'uint8', name: 'inputDecimals', type: 'uint8' }
    ],
    name: 'setFeeBase',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'address', name: 'feeTarget', type: 'address' }
    ],
    name: 'setFeeTarget',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'uint256', name: 'minAmount', type: 'uint256' },
      { internalType: 'uint8', name: 'inputDecimals', type: 'uint8' }
    ],
    name: 'setMinAmount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'contract ERC20', name: 'token', type: 'address' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
      { internalType: 'uint256', name: 'feeBase', type: 'uint256' },
      { internalType: 'address', name: 'feeTarget', type: 'address' },
      { internalType: 'uint256', name: 'minAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'dailyLimit', type: 'uint256' },
      { internalType: 'uint8', name: 'inputDecimals', type: 'uint8' }
    ],
    name: 'setToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: '', type: 'uint16' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'stats',
    outputs: [
      { internalType: 'uint256', name: 'transfered', type: 'uint256' },
      { internalType: 'uint256', name: 'limitFrom', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    name: 'tokens',
    outputs: [
      { internalType: 'contract ERC20', name: 'token', type: 'address' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
      { internalType: 'uint256', name: 'feeBase', type: 'uint256' },
      { internalType: 'address', name: 'feeTarget', type: 'address' },
      { internalType: 'uint256', name: 'minAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'dailyLimit', type: 'uint256' },
      { internalType: 'uint256', name: 'bonus', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'tokenId', type: 'uint16' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint8', name: 'inputDecimals', type: 'uint8' }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { stateMutability: 'payable', type: 'receive' }
];
