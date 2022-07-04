/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { EndorseERC721, EndorseERC721Interface } from "../EndorseERC721";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "endorser",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "endorsee",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "endorsementTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "contributionTokenId",
        type: "uint256",
      },
    ],
    name: "Endorse",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProjectAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "endorser",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "contributionTokenId",
        type: "uint256",
      },
    ],
    name: "hasEndorsedContribution",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contributionTokenId",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract project_contributions",
        name: "_project_contributions",
        type: "address",
      },
    ],
    name: "setProjectAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "endorseTokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162003016380380620030168339818101604052810190620000379190620003b8565b81818160009080519060200190620000519291906200016b565b5080600190805190602001906200006a9291906200016b565b5050506200008d620000816200009d60201b60201c565b620000a560201b60201c565b60006007819055505050620004a2565b600033905090565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b82805462000179906200046c565b90600052602060002090601f0160209004810192826200019d5760008555620001e9565b82601f10620001b857805160ff1916838001178555620001e9565b82800160010185558215620001e9579182015b82811115620001e8578251825591602001919060010190620001cb565b5b509050620001f89190620001fc565b5090565b5b8082111562000217576000816000905550600101620001fd565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620002848262000239565b810181811067ffffffffffffffff82111715620002a657620002a56200024a565b5b80604052505050565b6000620002bb6200021b565b9050620002c9828262000279565b919050565b600067ffffffffffffffff821115620002ec57620002eb6200024a565b5b620002f78262000239565b9050602081019050919050565b60005b838110156200032457808201518184015260208101905062000307565b8381111562000334576000848401525b50505050565b6000620003516200034b84620002ce565b620002af565b90508281526020810184848401111562000370576200036f62000234565b5b6200037d84828562000304565b509392505050565b600082601f8301126200039d576200039c6200022f565b5b8151620003af8482602086016200033a565b91505092915050565b60008060408385031215620003d257620003d162000225565b5b600083015167ffffffffffffffff811115620003f357620003f26200022a565b5b620004018582860162000385565b925050602083015167ffffffffffffffff8111156200042557620004246200022a565b5b620004338582860162000385565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200048557607f821691505b602082108114156200049c576200049b6200043d565b5b50919050565b612b6480620004b26000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c8063715018a6116100b8578063b88d4fde1161007c578063b88d4fde14610338578063c87b56dd14610354578063d47f4d2a14610384578063e985e9c5146103a2578063f2fde38b146103d2578063fce0f928146103ee57610137565b8063715018a6146102ba5780638da5cb5b146102c457806395d89b41146102e2578063a0712d6814610300578063a22cb4651461031c57610137565b806327f51a91116100ff57806327f51a91146101f257806342842e0e1461022257806342966c681461023e5780636352211e1461025a57806370a082311461028a57610137565b806301ffc9a71461013c57806306fdde031461016c578063081812fc1461018a578063095ea7b3146101ba57806323b872dd146101d6575b600080fd5b61015660048036038101906101519190611a89565b61041e565b6040516101639190611ad1565b60405180910390f35b610174610500565b6040516101819190611b85565b60405180910390f35b6101a4600480360381019061019f9190611bdd565b610592565b6040516101b19190611c4b565b60405180910390f35b6101d460048036038101906101cf9190611c92565b610617565b005b6101f060048036038101906101eb9190611cd2565b61072f565b005b61020c60048036038101906102079190611c92565b61076a565b6040516102199190611ad1565b60405180910390f35b61023c60048036038101906102379190611cd2565b6107d9565b005b61025860048036038101906102539190611bdd565b610814565b005b610274600480360381019061026f9190611bdd565b6108ff565b6040516102819190611c4b565b60405180910390f35b6102a4600480360381019061029f9190611d25565b6109b1565b6040516102b19190611d61565b60405180910390f35b6102c2610a69565b005b6102cc610af1565b6040516102d99190611c4b565b60405180910390f35b6102ea610b1b565b6040516102f79190611b85565b60405180910390f35b61031a60048036038101906103159190611bdd565b610bad565b005b61033660048036038101906103319190611da8565b610fbc565b005b610352600480360381019061034d9190611f1d565b610fd2565b005b61036e60048036038101906103699190611bdd565b61100d565b60405161037b9190611b85565b60405180910390f35b61038c6110d0565b6040516103999190611c4b565b60405180910390f35b6103bc60048036038101906103b79190611fa0565b6110fa565b6040516103c99190611ad1565b60405180910390f35b6103ec60048036038101906103e79190611d25565b61118e565b005b6104086004803603810190610403919061201e565b611286565b6040516104159190611c4b565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806104e957507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806104f957506104f88261136f565b5b9050919050565b60606000805461050f9061207a565b80601f016020809104026020016040519081016040528092919081815260200182805461053b9061207a565b80156105885780601f1061055d57610100808354040283529160200191610588565b820191906000526020600020905b81548152906001019060200180831161056b57829003601f168201915b5050505050905090565b600061059d826113d9565b6105dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105d39061211e565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000610622826108ff565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610693576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068a906121b0565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166106b2611445565b73ffffffffffffffffffffffffffffffffffffffff1614806106e157506106e0816106db611445565b6110fa565b5b610720576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161071790612242565b60405180910390fd5b61072a838361144d565b505050565b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610761906122ae565b60405180910390fd5b6000600115156009600084815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514905092915050565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161080b906122ae565b60405180910390fd5b61081d816108ff565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461088a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161088190612340565b60405180910390fd5b61089381611506565b60006009600083815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156109a8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161099f906123d2565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610a22576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a1990612464565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610a71611445565b73ffffffffffffffffffffffffffffffffffffffff16610a8f610af1565b73ffffffffffffffffffffffffffffffffffffffff1614610ae5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610adc906124d0565b60405180910390fd5b610aef6000611617565b565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060018054610b2a9061207a565b80601f0160208091040260200160405190810160405280929190818152602001828054610b569061207a565b8015610ba35780601f10610b7857610100808354040283529160200191610ba3565b820191906000526020600020905b815481529060010190602001808311610b8657829003601f168201915b5050505050905090565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1662923f9e826040518263ffffffff1660e01b8152600401610c079190611d61565b602060405180830381865afa158015610c24573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c489190612505565b610c87576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c7e9061257e565b60405180910390fd5b6000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b8152600401610ce49190611c4b565b602060405180830381865afa158015610d01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d2591906125b3565b11610d65576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d5c90612678565b60405180910390fd5b600015156009600083815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610e09576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e009061270a565b60405180910390fd5b610e15336007546116dd565b60016009600083815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080600a60006007548152602001908152602001600020819055506000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e836040518263ffffffff1660e01b8152600401610ef59190611d61565b602060405180830381865afa158015610f12573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f36919061273f565b90506007548173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f356571a6ca8e1a8f7edf47ba7ce9380ec968da38147ce468113dc66d6120e55785604051610f989190611d61565b60405180910390a460076000815480929190610fb39061279b565b91905055505050565b610fce610fc7611445565b83836118ab565b5050565b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611004906122ae565b60405180910390fd5b60606000600a6000848152602001908152602001600020549050600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c87b56dd826040518263ffffffff1660e01b81526004016110829190611d61565b600060405180830381865afa15801561109f573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906110c89190612885565b915050919050565b6000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b611196611445565b73ffffffffffffffffffffffffffffffffffffffff166111b4610af1565b73ffffffffffffffffffffffffffffffffffffffff161461120a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611201906124d0565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561127a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161127190612940565b60405180910390fd5b61128381611617565b50565b6000611290611445565b73ffffffffffffffffffffffffffffffffffffffff166112ae610af1565b73ffffffffffffffffffffffffffffffffffffffff1614611304576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112fb906124d0565b60405180910390fd5b81600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff166114c0836108ff565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000611511826108ff565b905061151f81600084611a18565b61152a60008361144d565b6001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461157a9190612960565b925050819055506002600083815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905581600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561174d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611744906129e0565b60405180910390fd5b611756816113d9565b15611796576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161178d90612a4c565b60405180910390fd5b6117a260008383611a18565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546117f29190612a6c565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561191a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161191190612b0e565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611a0b9190611ad1565b60405180910390a3505050565b505050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611a6681611a31565b8114611a7157600080fd5b50565b600081359050611a8381611a5d565b92915050565b600060208284031215611a9f57611a9e611a27565b5b6000611aad84828501611a74565b91505092915050565b60008115159050919050565b611acb81611ab6565b82525050565b6000602082019050611ae66000830184611ac2565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611b26578082015181840152602081019050611b0b565b83811115611b35576000848401525b50505050565b6000601f19601f8301169050919050565b6000611b5782611aec565b611b618185611af7565b9350611b71818560208601611b08565b611b7a81611b3b565b840191505092915050565b60006020820190508181036000830152611b9f8184611b4c565b905092915050565b6000819050919050565b611bba81611ba7565b8114611bc557600080fd5b50565b600081359050611bd781611bb1565b92915050565b600060208284031215611bf357611bf2611a27565b5b6000611c0184828501611bc8565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611c3582611c0a565b9050919050565b611c4581611c2a565b82525050565b6000602082019050611c606000830184611c3c565b92915050565b611c6f81611c2a565b8114611c7a57600080fd5b50565b600081359050611c8c81611c66565b92915050565b60008060408385031215611ca957611ca8611a27565b5b6000611cb785828601611c7d565b9250506020611cc885828601611bc8565b9150509250929050565b600080600060608486031215611ceb57611cea611a27565b5b6000611cf986828701611c7d565b9350506020611d0a86828701611c7d565b9250506040611d1b86828701611bc8565b9150509250925092565b600060208284031215611d3b57611d3a611a27565b5b6000611d4984828501611c7d565b91505092915050565b611d5b81611ba7565b82525050565b6000602082019050611d766000830184611d52565b92915050565b611d8581611ab6565b8114611d9057600080fd5b50565b600081359050611da281611d7c565b92915050565b60008060408385031215611dbf57611dbe611a27565b5b6000611dcd85828601611c7d565b9250506020611dde85828601611d93565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611e2a82611b3b565b810181811067ffffffffffffffff82111715611e4957611e48611df2565b5b80604052505050565b6000611e5c611a1d565b9050611e688282611e21565b919050565b600067ffffffffffffffff821115611e8857611e87611df2565b5b611e9182611b3b565b9050602081019050919050565b82818337600083830152505050565b6000611ec0611ebb84611e6d565b611e52565b905082815260208101848484011115611edc57611edb611ded565b5b611ee7848285611e9e565b509392505050565b600082601f830112611f0457611f03611de8565b5b8135611f14848260208601611ead565b91505092915050565b60008060008060808587031215611f3757611f36611a27565b5b6000611f4587828801611c7d565b9450506020611f5687828801611c7d565b9350506040611f6787828801611bc8565b925050606085013567ffffffffffffffff811115611f8857611f87611a2c565b5b611f9487828801611eef565b91505092959194509250565b60008060408385031215611fb757611fb6611a27565b5b6000611fc585828601611c7d565b9250506020611fd685828601611c7d565b9150509250929050565b6000611feb82611c2a565b9050919050565b611ffb81611fe0565b811461200657600080fd5b50565b60008135905061201881611ff2565b92915050565b60006020828403121561203457612033611a27565b5b600061204284828501612009565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061209257607f821691505b602082108114156120a6576120a561204b565b5b50919050565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b6000612108602c83611af7565b9150612113826120ac565b604082019050919050565b60006020820190508181036000830152612137816120fb565b9050919050565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b600061219a602183611af7565b91506121a58261213e565b604082019050919050565b600060208201905081810360008301526121c98161218d565b9050919050565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b600061222c603883611af7565b9150612237826121d0565b604082019050919050565b6000602082019050818103600083015261225b8161221f565b9050919050565b7f546f6b656e7320617265206e6f74207472616e736665727261626c6500000000600082015250565b6000612298601c83611af7565b91506122a382612262565b602082019050919050565b600060208201905081810360008301526122c78161228b565b9050919050565b7f4d757374206265206f776e6572206f6620746f6b656e20746f2062652061626c60008201527f6520746f206275726e2069740000000000000000000000000000000000000000602082015250565b600061232a602c83611af7565b9150612335826122ce565b604082019050919050565b600060208201905081810360008301526123598161231d565b9050919050565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b60006123bc602983611af7565b91506123c782612360565b604082019050919050565b600060208201905081810360008301526123eb816123af565b9050919050565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b600061244e602a83611af7565b9150612459826123f2565b604082019050919050565b6000602082019050818103600083015261247d81612441565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006124ba602083611af7565b91506124c582612484565b602082019050919050565b600060208201905081810360008301526124e9816124ad565b9050919050565b6000815190506124ff81611d7c565b92915050565b60006020828403121561251b5761251a611a27565b5b6000612529848285016124f0565b91505092915050565b7f436f6e747269627574696f6e20746f6b656e206d757374206578697374000000600082015250565b6000612568601d83611af7565b915061257382612532565b602082019050919050565b600060208201905081810360008301526125978161255b565b9050919050565b6000815190506125ad81611bb1565b92915050565b6000602082840312156125c9576125c8611a27565b5b60006125d78482850161259e565b91505092915050565b7f43616e6e6f7420656e646f72736520776974686f757420616e7920636f6e747260008201527f69627574696f6e73206177617264656420666f722074686973206163636f756e60208201527f742e000000000000000000000000000000000000000000000000000000000000604082015250565b6000612662604283611af7565b915061266d826125e0565b606082019050919050565b6000602082019050818103600083015261269181612655565b9050919050565b7f436f6e747269627574696f6e732063616e6e6f7420626520656e646f7273656460008201527f2074776963650000000000000000000000000000000000000000000000000000602082015250565b60006126f4602683611af7565b91506126ff82612698565b604082019050919050565b60006020820190508181036000830152612723816126e7565b9050919050565b60008151905061273981611c66565b92915050565b60006020828403121561275557612754611a27565b5b60006127638482850161272a565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006127a682611ba7565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156127d9576127d861276c565b5b600182019050919050565b600067ffffffffffffffff8211156127ff576127fe611df2565b5b61280882611b3b565b9050602081019050919050565b6000612828612823846127e4565b611e52565b90508281526020810184848401111561284457612843611ded565b5b61284f848285611b08565b509392505050565b600082601f83011261286c5761286b611de8565b5b815161287c848260208601612815565b91505092915050565b60006020828403121561289b5761289a611a27565b5b600082015167ffffffffffffffff8111156128b9576128b8611a2c565b5b6128c584828501612857565b91505092915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b600061292a602683611af7565b9150612935826128ce565b604082019050919050565b600060208201905081810360008301526129598161291d565b9050919050565b600061296b82611ba7565b915061297683611ba7565b9250828210156129895761298861276c565b5b828203905092915050565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b60006129ca602083611af7565b91506129d582612994565b602082019050919050565b600060208201905081810360008301526129f9816129bd565b9050919050565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b6000612a36601c83611af7565b9150612a4182612a00565b602082019050919050565b60006020820190508181036000830152612a6581612a29565b9050919050565b6000612a7782611ba7565b9150612a8283611ba7565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612ab757612ab661276c565b5b828201905092915050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b6000612af8601983611af7565b9150612b0382612ac2565b602082019050919050565b60006020820190508181036000830152612b2781612aeb565b905091905056fea2646970667358221220e4f10602f49575dacca717aab487a381d8a05a7af6b3c6158a6959be7dce1a9b64736f6c634300080c0033";

type EndorseERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EndorseERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EndorseERC721__factory extends ContractFactory {
  constructor(...args: EndorseERC721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "EndorseERC721";
  }

  deploy(
    _name: string,
    _symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EndorseERC721> {
    return super.deploy(
      _name,
      _symbol,
      overrides || {}
    ) as Promise<EndorseERC721>;
  }
  getDeployTransaction(
    _name: string,
    _symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_name, _symbol, overrides || {});
  }
  attach(address: string): EndorseERC721 {
    return super.attach(address) as EndorseERC721;
  }
  connect(signer: Signer): EndorseERC721__factory {
    return super.connect(signer) as EndorseERC721__factory;
  }
  static readonly contractName: "EndorseERC721";
  public readonly contractName: "EndorseERC721";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EndorseERC721Interface {
    return new utils.Interface(_abi) as EndorseERC721Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EndorseERC721 {
    return new Contract(address, _abi, signerOrProvider) as EndorseERC721;
  }
}