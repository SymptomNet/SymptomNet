/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/symptom_net_contract.json`.
 */
export type SymptomNetContract = {
  "address": "BqRrKSm8bYvHMqyYjrL4WiC13JKL89VYFm8TV7QXaFWN",
  "metadata": {
    "name": "symptomNetContract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "getAllDoctors",
      "discriminator": [
        206,
        91,
        230,
        180,
        233,
        224,
        194,
        248
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true
        },
        {
          "name": "doctorList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  99,
                  116,
                  111,
                  114,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "maxResults",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getAllRecords",
      "discriminator": [
        58,
        99,
        38,
        161,
        236,
        175,
        71,
        57
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true
        },
        {
          "name": "recordCounter",
          "writable": true
        },
        {
          "name": "recordList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  111,
                  114,
                  100,
                  45,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "maxResults",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getDoctorStats",
      "discriminator": [
        98,
        141,
        31,
        80,
        168,
        237,
        65,
        184
      ],
      "accounts": [
        {
          "name": "doctor",
          "writable": true,
          "signer": true
        },
        {
          "name": "doctorAccount",
          "writable": true
        },
        {
          "name": "stats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  99,
                  116,
                  111,
                  114,
                  45,
                  115,
                  116,
                  97,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "doctor_account.wallet",
                "account": "doctor"
              }
            ]
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "getRecordStatus",
      "discriminator": [
        253,
        24,
        251,
        194,
        45,
        191,
        181,
        151
      ],
      "accounts": [
        {
          "name": "doctor",
          "writable": true,
          "signer": true
        },
        {
          "name": "record",
          "writable": true
        },
        {
          "name": "status",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  111,
                  114,
                  100,
                  45,
                  115,
                  116,
                  97,
                  116,
                  117,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "record.id",
                "account": "record"
              }
            ]
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "recordCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  111,
                  114,
                  100,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  89,
                  77,
                  80,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "registerDoctor",
      "discriminator": [
        181,
        67,
        216,
        215,
        132,
        240,
        147,
        125
      ],
      "accounts": [
        {
          "name": "doctorWallet",
          "writable": true,
          "signer": true
        },
        {
          "name": "doctorAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  99,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "doctorWallet"
              }
            ]
          }
        },
        {
          "name": "doctorTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  99,
                  116,
                  111,
                  114,
                  45,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "doctorWallet"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "state",
          "writable": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "resetRecordCount",
      "discriminator": [
        98,
        163,
        119,
        125,
        67,
        114,
        74,
        202
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true
        },
        {
          "name": "recordCounter",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "submitRecord",
      "discriminator": [
        228,
        62,
        113,
        235,
        20,
        182,
        203,
        101
      ],
      "accounts": [
        {
          "name": "doctor",
          "writable": true,
          "signer": true
        },
        {
          "name": "doctorAccount",
          "writable": true
        },
        {
          "name": "state",
          "writable": true
        },
        {
          "name": "recordCounter",
          "writable": true
        },
        {
          "name": "record",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "state.authority",
                "account": "symptomNetState"
              },
              {
                "kind": "account",
                "path": "record_counter.counter",
                "account": "recordCounter"
              }
            ]
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "sickness",
          "type": "string"
        },
        {
          "name": "symptoms",
          "type": "string"
        },
        {
          "name": "treatment",
          "type": "string"
        }
      ]
    },
    {
      "name": "verifyRecord",
      "discriminator": [
        95,
        2,
        230,
        207,
        188,
        217,
        145,
        202
      ],
      "accounts": [
        {
          "name": "doctor",
          "writable": true,
          "signer": true
        },
        {
          "name": "doctorAccount",
          "writable": true
        },
        {
          "name": "submitterAccount",
          "writable": true
        },
        {
          "name": "record",
          "writable": true
        },
        {
          "name": "state",
          "writable": true
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "doctorTokenAccount",
          "writable": true
        },
        {
          "name": "submitterTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "doctor",
      "discriminator": [
        162,
        178,
        42,
        216,
        185,
        32,
        68,
        183
      ]
    },
    {
      "name": "doctorList",
      "discriminator": [
        157,
        26,
        44,
        31,
        181,
        23,
        38,
        252
      ]
    },
    {
      "name": "doctorStats",
      "discriminator": [
        218,
        31,
        190,
        17,
        143,
        81,
        10,
        101
      ]
    },
    {
      "name": "record",
      "discriminator": [
        254,
        233,
        117,
        252,
        76,
        166,
        146,
        139
      ]
    },
    {
      "name": "recordCounter",
      "discriminator": [
        58,
        105,
        93,
        205,
        219,
        64,
        237,
        92
      ]
    },
    {
      "name": "recordList",
      "discriminator": [
        202,
        111,
        125,
        24,
        231,
        57,
        78,
        0
      ]
    },
    {
      "name": "recordStatus",
      "discriminator": [
        248,
        103,
        218,
        152,
        45,
        65,
        192,
        2
      ]
    },
    {
      "name": "symptomNetState",
      "discriminator": [
        233,
        145,
        180,
        0,
        198,
        172,
        202,
        77
      ]
    }
  ],
  "types": [
    {
      "name": "doctor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "contributionScore",
            "type": "u64"
          },
          {
            "name": "recordsSubmitted",
            "type": "u64"
          },
          {
            "name": "recordsVerified",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "doctorList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "total",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "doctorStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contributionScore",
            "type": "u64"
          },
          {
            "name": "recordsSubmitted",
            "type": "u64"
          },
          {
            "name": "recordsVerified",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "record",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "sickness",
            "type": "string"
          },
          {
            "name": "symptoms",
            "type": "string"
          },
          {
            "name": "submitter",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": "string"
          },
          {
            "name": "verificationCount",
            "type": "u64"
          },
          {
            "name": "verifier1",
            "type": "pubkey"
          },
          {
            "name": "verifier2",
            "type": "pubkey"
          },
          {
            "name": "verifier3",
            "type": "pubkey"
          },
          {
            "name": "hasVerifier1",
            "type": "bool"
          },
          {
            "name": "hasVerifier2",
            "type": "bool"
          },
          {
            "name": "hasVerifier3",
            "type": "bool"
          },
          {
            "name": "treatment",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "recordCounter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "recordList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "total",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "recordStatus",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "status",
            "type": "string"
          },
          {
            "name": "verificationCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "symptomNetState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "totalRecords",
            "type": "u64"
          },
          {
            "name": "totalDoctors",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
