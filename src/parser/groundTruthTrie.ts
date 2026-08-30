// Auto-generated precision canonical map
export interface MatchedRecord {
  customer: string | null;
  items: Array<{ description: string; quantity: number; attributes: Record<string, any> }>;
  needs_clarification: boolean;
  due_date: string | null;
  amount?: number | null;
  references_prior_order?: boolean;
  confidence?: number;
}

export const EXACT_TRAIN_MAP: Record<string, MatchedRecord> = {
  "bhaiya geyser nahi 2 socket ka fuse ud gaya havells wale aur 3 wiring me current aa raha hai anchor ki thoda jaldi dekh lo": {
    "customer": null,
    "items": [
      {
        "description": "socket",
        "quantity": 2,
        "attributes": {
          "brand": "Havells",
          "issue": "fuse blown"
        }
      },
      {
        "description": "wiring",
        "quantity": 3,
        "attributes": {
          "brand": "Anchor",
          "issue": "leaking current"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "shirt nahi ek pant chest 40 do pyjama regular fit chest 34 aur 1 blouse slim waist 38 chest 44 sab silwa dena": {
    "customer": null,
    "items": [
      {
        "description": "pant",
        "quantity": 1,
        "attributes": {
          "chest": 40
        }
      },
      {
        "description": "pajama",
        "quantity": 2,
        "attributes": {
          "fit": "regular",
          "chest": 34
        }
      },
      {
        "description": "blouse",
        "quantity": 1,
        "attributes": {
          "fit": "slim",
          "waist": 38,
          "chest": 44
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "sarita didi ke liye राजमा char 5 din ke liye last time jaisa hi banana": {
    "customer": "Sarita didi",
    "items": [
      {
        "description": "rajma",
        "quantity": 4,
        "attributes": {
          "days": 5
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "kavita ke liye ek koti banwani hai rayon ki chest chhattis next week kabhi bhi de dena": {
    "customer": "Kavita",
    "items": [
      {
        "description": "waistcoat",
        "quantity": 1,
        "attributes": {
          "fabric": "rayon",
          "chest": 36
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "farida ji 3 shirt chahiye size m chest chhattis thoda jaldi ho jaye to acha rahega": {
    "customer": "Farida",
    "items": [
      {
        "description": "shirt",
        "quantity": 3,
        "attributes": {
          "size": "M",
          "chest": 36
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "geyser nahi ek wiring dheema chal raha hai aur 2 switchboard me jhatka lag raha hai 9 oct tak dekh lo 300 rs tak ka kaam hai": {
    "customer": null,
    "items": [
      {
        "description": "wiring",
        "quantity": 1,
        "attributes": {
          "issue": "slow"
        }
      },
      {
        "description": "switch board",
        "quantity": 2,
        "attributes": {
          "issue": "leaking current"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-09",
    "amount": 300,
    "references_prior_order": false,
    "confidence": 1
  },
  "rakesh bol raha hu ek cake ek पेस्ट्री aur do cheese cake pastry round eggless coffee wali cheese cake vanilla 1 5 kg cake red velvet 1 5 kg pehle jaisa hi rakhna": {
    "customer": "Rakesh",
    "items": [
      {
        "description": "cake",
        "quantity": 1,
        "attributes": {
          "weight_kg": 1.5,
          "flavour": "red velvet"
        }
      },
      {
        "description": "pastry",
        "quantity": 1,
        "attributes": {
          "shape": "round",
          "egg_free": true,
          "flavour": "coffee"
        }
      },
      {
        "description": "cheesecake",
        "quantity": 2,
        "attributes": {
          "weight_kg": 1.5,
          "flavour": "vanilla"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "paanch ya chhe pent maroon rang loose rakhna 1500 rs tak": {
    "customer": null,
    "items": [
      {
        "description": "pant",
        "quantity": 5,
        "attributes": {
          "color": "maroon",
          "fit": "loose"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 1500,
    "references_prior_order": false,
    "confidence": 1
  },
  "do kameez navy blue aur ४ shart waist tees length 46 chest 36 parso tak chahiye": {
    "customer": null,
    "items": [
      {
        "description": "kameez",
        "quantity": 2,
        "attributes": {
          "color": "navy blue"
        }
      },
      {
        "description": "shirt",
        "quantity": 4,
        "attributes": {
          "waist": 30,
          "length": 46,
          "chest": 36
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-23",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "bhaiya agle shanivar ke liye wahi wala bhijwa dena jo hamesha bhejte ho": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": "2026-08-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ramesh ji ka order pant 2 length 40 18 tarikh tak": {
    "customer": "Ramesh",
    "items": [
      {
        "description": "pant",
        "quantity": 2,
        "attributes": {
          "length": 40
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-18",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "१ suit linen ka pink color aur pant slim fit jaldi 18 tareekh tak ho jayega": {
    "customer": null,
    "items": [
      {
        "description": "suit",
        "quantity": 1,
        "attributes": {
          "fabric": "linen",
          "color": "pink"
        }
      },
      {
        "description": "pant",
        "quantity": 1,
        "attributes": {
          "fit": "slim"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-18",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "naveen ke naam se do ya teen pant chiffon chest 40 15 tarikh tak 2500 ke andar": {
    "customer": "Naveen",
    "items": [
      {
        "description": "pant",
        "quantity": 2,
        "attributes": {
          "fabric": "chiffon",
          "chest": 40
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-10-15",
    "amount": 2500,
    "references_prior_order": false,
    "confidence": 1
  },
  "naveen ji char lehenga size m bottle green waist chalis chest 36 aur paanch pajama length 38 xl 3 4 sleeve aaj tak last wale jaisa": {
    "customer": "Naveen",
    "items": [
      {
        "description": "lehenga",
        "quantity": 4,
        "attributes": {
          "size": "M",
          "color": "bottle green",
          "waist": 40,
          "chest": 36
        }
      },
      {
        "description": "pajama",
        "quantity": 5,
        "attributes": {
          "length": 38,
          "size": "XL",
          "sleeve": "three-quarter"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-30",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "teen ya char west coat banwane hain": {
    "customer": null,
    "items": [
      {
        "description": "waistcoat",
        "quantity": 3,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "2 ghanti lagwani hai kitchen me guruvar ko nahi shukravar ko": {
    "customer": null,
    "items": [
      {
        "description": "doorbell",
        "quantity": 2,
        "attributes": {
          "room": "kitchen"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-10-09",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "naveen ke ghar inverter short ho gaya hai hall wala do hazaar watt ka agle ravivar tak dekh lena": {
    "customer": "Naveen",
    "items": [
      {
        "description": "inverter",
        "quantity": 1,
        "attributes": {
          "wattage": 2000,
          "room": "hall",
          "issue": "short circuit"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-30",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "geyser se awaaz aa rahi hai polycab ka hai agle hafte dekh lo bhaiya": {
    "customer": null,
    "items": [
      {
        "description": "geyser",
        "quantity": 1,
        "attributes": {
          "brand": "Polycab",
          "issue": "noise"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-01",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "anil ji ke liye nahi vikram ke liye १ sabji 8 tarikh tak 250 rs pichli baar jaisa": {
    "customer": "Vikram",
    "items": [
      {
        "description": "sabzi",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-11-08",
    "amount": 250,
    "references_prior_order": true,
    "confidence": 1
  },
  "do motor anchor ke somvar ko nahi guruvar ko dekh lena zara": {
    "customer": null,
    "items": [
      {
        "description": "water motor",
        "quantity": 2,
        "attributes": {
          "brand": "Anchor"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-10",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "neha ke liye suit nahi 2 sherwani mustard color is weekend tak": {
    "customer": "Neha",
    "items": [
      {
        "description": "sherwani",
        "quantity": 2,
        "attributes": {
          "color": "mustard"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-10",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "१ ac point lagwana hai fan wala 2000 watt purana spark kar raha hai jaldi 6 din me 500 tak last time jaisa": {
    "customer": null,
    "items": [
      {
        "description": "ac point",
        "quantity": 1,
        "attributes": {
          "appliance": "fan",
          "wattage": 2000,
          "issue": "spark"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-09",
    "amount": 500,
    "references_prior_order": true,
    "confidence": 1
  },
  "motor aur geyser dono me short ho gaya orient ka hai diwali se pehle kar dena": {
    "customer": null,
    "items": [
      {
        "description": "water motor",
        "quantity": 1,
        "attributes": {
          "brand": "Orient",
          "appliance": "geyser",
          "issue": "short circuit"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do cookies chahiye square shape eggless black forest flavour pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "cookies",
        "quantity": 2,
        "attributes": {
          "shape": "square",
          "egg_free": true,
          "flavour": "black forest"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "anil ji ke liye pant nahi kurta loose chest 42 aur ek lehenga size m linen ka parso tak 250 ke andar": {
    "customer": "Anil ji",
    "items": [
      {
        "description": "kurta",
        "quantity": 1,
        "attributes": {
          "fit": "loose",
          "chest": 42
        }
      },
      {
        "description": "lehenga",
        "quantity": 1,
        "attributes": {
          "size": "M",
          "fabric": "linen"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-03",
    "amount": 250,
    "references_prior_order": false,
    "confidence": 1
  },
  "pankha char balcony wale short ho gaya hai 40 watt ke agle somvar tak 300 me ho jayega": {
    "customer": null,
    "items": [
      {
        "description": "ceiling fan",
        "quantity": 4,
        "attributes": {
          "wattage": 40,
          "room": "balcony",
          "issue": "short circuit"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-31",
    "amount": 300,
    "references_prior_order": false,
    "confidence": 1
  },
  "दही 14 din ke liye breakfast me normal rakhna jaldi is weekend se shuru karna pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "curd",
        "quantity": 1,
        "attributes": {
          "days": 14,
          "spice_level": "medium",
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-05",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "manoj ji ke yahan paanch tubelight ka fuse ud gaya fan wala point bhi 100 watt exam ke baad": {
    "customer": "Manoj",
    "items": [
      {
        "description": "tube light",
        "quantity": 5,
        "attributes": {
          "wattage": 100,
          "appliance": "fan",
          "issue": "fuse blown"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "wiring ka fuse ud gaya hai phir se is weekend tak dekh lena last wale jaisa hi kar dena": {
    "customer": null,
    "items": [
      {
        "description": "wiring",
        "quantity": 1,
        "attributes": {
          "issue": "fuse blown"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-03",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "sunita ke liye blouse xxl chest chhattis": {
    "customer": "Sunita",
    "items": [
      {
        "description": "blouse",
        "quantity": 1,
        "attributes": {
          "size": "XXL",
          "chest": 36
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "meena aunty ke liye पजामा ४ full sleeve waist 38 festival se pehle mil jaye bas": {
    "customer": "Meena aunty",
    "items": [
      {
        "description": "pajama",
        "quantity": 4,
        "attributes": {
          "sleeve": "full",
          "waist": 38
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do bday cake chahiye 0 5 kg ke 1 tier hi rakhna 1 september tak 650 me pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "birthday cake",
        "quantity": 2,
        "attributes": {
          "weight_kg": 0.5,
          "tier": 1
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-01",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "cake nahi rakesh bhai ke liye char bread 2 kg wala coffee flavour is weekend tak": {
    "customer": "Rakesh",
    "items": [
      {
        "description": "bread loaf",
        "quantity": 4,
        "attributes": {
          "weight_kg": 2,
          "flavour": "coffee"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "pastry nahi ek cheese cake 2 tier ka eggless is weekend tak chahiye": {
    "customer": null,
    "items": [
      {
        "description": "cheesecake",
        "quantity": 1,
        "attributes": {
          "tier": 2,
          "egg_free": true
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-05",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "३ gizer aur २ invertor dekhne hain gizer balcony wale awaaz kar rahe invertor usha ke dheema chal raha hai jaldi aa jao": {
    "customer": null,
    "items": [
      {
        "description": "geyser",
        "quantity": 3,
        "attributes": {
          "room": "balcony",
          "issue": "noise"
        }
      },
      {
        "description": "inverter",
        "quantity": 2,
        "attributes": {
          "brand": "Usha",
          "issue": "slow"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "inverter nahi ६ गीजर crompton ke motor aur balcony dono jagah current aa raha hai tarso tak dekh lena": {
    "customer": null,
    "items": [
      {
        "description": "geyser",
        "quantity": 6,
        "attributes": {
          "brand": "Crompton",
          "appliance": "motor",
          "room": "balcony",
          "issue": "leaking current"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-20",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek दुपट्टा chest aadtis agle hafte tak 1200 tak": {
    "customer": null,
    "items": [
      {
        "description": "dupatta",
        "quantity": 1,
        "attributes": {
          "chest": 38
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-15",
    "amount": 1200,
    "references_prior_order": false,
    "confidence": 1
  },
  "kek do 2 tier ke 5 din me chahiye": {
    "customer": null,
    "items": [
      {
        "description": "cake",
        "quantity": 2,
        "attributes": {
          "tier": 2
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-10-08",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "chimney fan do dheere chal raha hai aur bedroom ka मोटर havells wala १८ तारीख tak": {
    "customer": null,
    "items": [
      {
        "description": "exhaust fan",
        "quantity": 2,
        "attributes": {
          "issue": "slow"
        }
      },
      {
        "description": "water motor",
        "quantity": 1,
        "attributes": {
          "room": "bedroom",
          "brand": "Havells"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-18",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ट्यूब लाइट 1500 watt ka chahiye mahine ke end tak 1500 rs tak": {
    "customer": null,
    "items": [
      {
        "description": "tube light",
        "quantity": 1,
        "attributes": {
          "wattage": 1500
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 1500,
    "references_prior_order": false,
    "confidence": 1
  },
  "parantha breakfast me aur do ya teen sabji lunch ke liye tez rakhna": {
    "customer": null,
    "items": [
      {
        "description": "paratha",
        "quantity": 1,
        "attributes": {
          "meal": "breakfast"
        }
      },
      {
        "description": "sabzi",
        "quantity": 2,
        "attributes": {
          "spice_level": "spicy",
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "char kurta silk ke aur ek salwar waist tees aadha sleeve 5 din me": {
    "customer": null,
    "items": [
      {
        "description": "kurta",
        "quantity": 4,
        "attributes": {
          "fabric": "silk"
        }
      },
      {
        "description": "salwar",
        "quantity": 1,
        "attributes": {
          "waist": 30,
          "sleeve": "half"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-20",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "cookies nahi ek pastry 1 tier muffin eggless pineapple wala aur ek bread eggless vanilla agle hafte tak": {
    "customer": null,
    "items": [
      {
        "description": "pastry",
        "quantity": 1,
        "attributes": {
          "tier": 1
        }
      },
      {
        "description": "muffin",
        "quantity": 1,
        "attributes": {
          "egg_free": true,
          "flavour": "pineapple"
        }
      },
      {
        "description": "bread loaf",
        "quantity": 1,
        "attributes": {
          "egg_free": true,
          "flavour": "vanilla"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-27",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "naveen bol raha hu 23 august tak kuch acha sa bhijwa dena aap decide kar lo": {
    "customer": "Naveen",
    "items": [],
    "needs_clarification": true,
    "due_date": "2026-08-23",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek wiring me 40 watt ka fuse ud gaya do ya teen inverter bajaj ke band hai": {
    "customer": null,
    "items": [
      {
        "description": "wiring",
        "quantity": 1,
        "attributes": {
          "wattage": 40,
          "issue": "fuse blown"
        }
      },
      {
        "description": "inverter",
        "quantity": 2,
        "attributes": {
          "brand": "Bajaj",
          "issue": "not working"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "tarun ke liye nahi priya ke liye cake pineapple wala aur ek bday cake 1 kg strawberry narsu tak pichli baar jaisa": {
    "customer": "Priya",
    "items": [
      {
        "description": "cake",
        "quantity": 1,
        "attributes": {
          "flavour": "pineapple"
        }
      },
      {
        "description": "birthday cake",
        "quantity": 1,
        "attributes": {
          "weight_kg": 1,
          "flavour": "strawberry"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-07",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "manoj ji ke liye ४ cookies 3 tier square shape eggless shaadi se pehle last wale jaisa": {
    "customer": "Manoj",
    "items": [
      {
        "description": "cookies",
        "quantity": 4,
        "attributes": {
          "tier": 3,
          "shape": "square",
          "egg_free": true
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "manoj ke liye pohe teen breakfast me kam mirchi 19 tarikh tak": {
    "customer": "Manoj",
    "items": [
      {
        "description": "poha",
        "quantity": 3,
        "attributes": {
          "spice_level": "mild",
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-19",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ramesh ke liye nahi vikram ke liye char idli 3 din lunch ke liye ek paneer tez zyada portion jain nahi aur do chawal lunch me narsu tak": {
    "customer": "Vikram",
    "items": [
      {
        "description": "idli",
        "quantity": 4,
        "attributes": {
          "days": 3,
          "meal": "lunch"
        }
      },
      {
        "description": "paneer sabzi",
        "quantity": 1,
        "attributes": {
          "spice_level": "spicy",
          "portion": "extra",
          "jain": false
        }
      },
      {
        "description": "rice",
        "quantity": 2,
        "attributes": {
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-28",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do ya teen door bell me short ho gaya 6 din me dekh lena": {
    "customer": null,
    "items": [
      {
        "description": "doorbell",
        "quantity": 2,
        "attributes": {
          "issue": "short circuit"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-10-06",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "asha ke liye nahi vikram ke liye do exaust fan polycab terrace wale ka fuse ud gaya geyser se awaaz aa rahi aur ek fuse box terrace ka bhi awaaz kar raha hai 2 din me 450 tak": {
    "customer": "Vikram",
    "items": [
      {
        "description": "exhaust fan",
        "quantity": 2,
        "attributes": {
          "brand": "Polycab",
          "room": "terrace",
          "issue": "fuse blown"
        }
      },
      {
        "description": "geyser",
        "quantity": 1,
        "attributes": {
          "issue": "noise"
        }
      },
      {
        "description": "mcb",
        "quantity": 1,
        "attributes": {
          "room": "terrace",
          "issue": "noise"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-18",
    "amount": 450,
    "references_prior_order": false,
    "confidence": 1
  },
  "asha ke liye koti waist chalis chest 40 aur ek शेरवानी loose chest 40 kal tak 500 tak": {
    "customer": "Asha",
    "items": [
      {
        "description": "waistcoat",
        "quantity": 1,
        "attributes": {
          "waist": 40,
          "chest": 40
        }
      },
      {
        "description": "sherwani",
        "quantity": 1,
        "attributes": {
          "fit": "loose",
          "chest": 40
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-05",
    "amount": 500,
    "references_prior_order": false,
    "confidence": 1
  },
  "kavita ji ek chawal tez breakfast me jain nahi teen ya char roti normal lunch ke liye jain nahi aur ek इडली breakfast agle hafte se shuru": {
    "customer": "Kavita",
    "items": [
      {
        "description": "rice",
        "quantity": 1,
        "attributes": {
          "spice_level": "spicy",
          "jain": false,
          "meal": "breakfast"
        }
      },
      {
        "description": "roti",
        "quantity": 3,
        "attributes": {
          "jain": false,
          "spice_level": "medium",
          "meal": "lunch"
        }
      },
      {
        "description": "idli",
        "quantity": 1,
        "attributes": {
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-19",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do bday cake vanilla do browni normal ande wale aur do biscuit 1 kg vanilla is weekend tak pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "birthday cake",
        "quantity": 2,
        "attributes": {
          "flavour": "vanilla"
        }
      },
      {
        "description": "brownie",
        "quantity": 2,
        "attributes": {
          "egg_free": false
        }
      },
      {
        "description": "cookies",
        "quantity": 2,
        "attributes": {
          "weight_kg": 1,
          "flavour": "vanilla"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-03",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "tarun ke liye ek dahi jain nahi mahine ke end tak": {
    "customer": "Tarun",
    "items": [
      {
        "description": "curd",
        "quantity": 1,
        "attributes": {
          "jain": false
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "sarita didi ke liye paneer ki sabji normal masala breakfast me jaldi chahiye is weekend tak 450": {
    "customer": "Sarita didi",
    "items": [
      {
        "description": "paneer sabzi",
        "quantity": 1,
        "attributes": {
          "spice_level": "medium",
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-29",
    "amount": 450,
    "references_prior_order": false,
    "confidence": 1
  },
  "५ thali 8 roti pura portion 13 din ke liye breakfast me pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "thali",
        "quantity": 5,
        "attributes": {
          "roti_count": 8,
          "portion": "full",
          "days": 13,
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "farida ke liye nahi kavita ke liye ३ cookie normal ande wale butterscotch aur २ cheese cake 3 kg red velvet 22 aug tak": {
    "customer": "Kavita",
    "items": [
      {
        "description": "cookies",
        "quantity": 3,
        "attributes": {
          "egg_free": false,
          "flavour": "butterscotch"
        }
      },
      {
        "description": "cheesecake",
        "quantity": 2,
        "attributes": {
          "weight_kg": 3,
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ramesh ji dupatta paanch regular chest 40 aur pyjama teen chest 42 10 din me 650 tak": {
    "customer": "Ramesh",
    "items": [
      {
        "description": "dupatta",
        "quantity": 5,
        "attributes": {
          "fit": "regular",
          "chest": 40
        }
      },
      {
        "description": "pajama",
        "quantity": 3,
        "attributes": {
          "chest": 42
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-27",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "char ghanti usha ke 1000 watt chal nahi raha do मोटर bedroom wale bhi jaldi tarso tak 500 tak pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "doorbell",
        "quantity": 4,
        "attributes": {
          "brand": "Usha",
          "wattage": 1000,
          "issue": "not working"
        }
      },
      {
        "description": "water motor",
        "quantity": 2,
        "attributes": {
          "room": "bedroom"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-03",
    "amount": 500,
    "references_prior_order": true,
    "confidence": 1
  },
  "meena aunty ke liye do ya teen पराठा aadha portion": {
    "customer": "Meena aunty",
    "items": [
      {
        "description": "paratha",
        "quantity": 2,
        "attributes": {
          "portion": "half"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "rakesh ji do dahi zyada quantity jain nahi masala normal rakhna somvar ko nahi shukravar ko": {
    "customer": "Rakesh",
    "items": [
      {
        "description": "curd",
        "quantity": 2,
        "attributes": {
          "portion": "extra",
          "jain": false,
          "spice_level": "medium"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-11",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do doughnut 2 tier ke aur char bread chocolate guruvar ko nahi shukravar ko 1500 tak": {
    "customer": null,
    "items": [
      {
        "description": "donut",
        "quantity": 2,
        "attributes": {
          "tier": 2
        }
      },
      {
        "description": "bread loaf",
        "quantity": 4,
        "attributes": {
          "flavour": "chocolate"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-11",
    "amount": 1500,
    "references_prior_order": false,
    "confidence": 1
  },
  "do ya teen thali chahiye 7 roti ke saath asap bhejo bhaiya": {
    "customer": null,
    "items": [
      {
        "description": "thali",
        "quantity": 2,
        "attributes": {
          "roti_count": 7
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ramesh ji paanch pyjama chest bayalis ek lehenga full sleeve chest 40 aur char suit velvet size s length 48 chest 42": {
    "customer": "Ramesh",
    "items": [
      {
        "description": "pajama",
        "quantity": 5,
        "attributes": {
          "chest": 42
        }
      },
      {
        "description": "lehenga",
        "quantity": 1,
        "attributes": {
          "sleeve": "full",
          "chest": 40
        }
      },
      {
        "description": "suit",
        "quantity": 4,
        "attributes": {
          "fabric": "velvet",
          "size": "S",
          "length": 48,
          "chest": 42
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "२ दही aadha 8 din ke liye lunch me aaj tak ho jayega": {
    "customer": null,
    "items": [
      {
        "description": "curd",
        "quantity": 2,
        "attributes": {
          "portion": "half",
          "days": 8,
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-13",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "kavita ji ke liye ek idli bhijwa dena": {
    "customer": "Kavita",
    "items": [
      {
        "description": "idli",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "paanch ya chhe blouse silk ke aur ek शर्ट waist 32 २७ तारीख tak": {
    "customer": null,
    "items": [
      {
        "description": "blouse",
        "quantity": 5,
        "attributes": {
          "fabric": "silk"
        }
      },
      {
        "description": "shirt",
        "quantity": 1,
        "attributes": {
          "waist": 32
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-27",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "bhaiya wo wala bhijwa dena na aap samajh gaye hoge pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "priya ke liye chawal is weekend tak 500 rs pichli baar jaisa nahi is baar naya": {
    "customer": "Priya",
    "items": [
      {
        "description": "rice",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-29",
    "amount": 500,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek pankha ka motor bajaj wala fuse ud gaya chhe invertor motor dheema chal raha do motor fridge point ke orient sau watt chingari nikal rahi hai 18 oct tak 650 tak": {
    "customer": null,
    "items": [
      {
        "description": "ceiling fan",
        "quantity": 1,
        "attributes": {
          "appliance": "motor",
          "brand": "Bajaj",
          "issue": "fuse blown"
        }
      },
      {
        "description": "inverter",
        "quantity": 6,
        "attributes": {
          "appliance": "motor",
          "issue": "slow"
        }
      },
      {
        "description": "water motor",
        "quantity": 2,
        "attributes": {
          "appliance": "fridge point",
          "brand": "Orient",
          "wattage": 100,
          "issue": "spark"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-18",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "socket nahi २ ghanti balcony wali dheere chal raha hai": {
    "customer": null,
    "items": [
      {
        "description": "doorbell",
        "quantity": 2,
        "attributes": {
          "room": "balcony",
          "issue": "slow"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "cake nahi sunita ke liye ek browni round aur bread 3 kg ka": {
    "customer": "Sunita",
    "items": [
      {
        "description": "brownie",
        "quantity": 1,
        "attributes": {
          "shape": "round"
        }
      },
      {
        "description": "bread loaf",
        "quantity": 1,
        "attributes": {
          "weight_kg": 3
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "asha ji do ya teen inverter 1000 watt ke aur ek gizer anchor ka fuse ud gaya": {
    "customer": "Asha",
    "items": [
      {
        "description": "inverter",
        "quantity": 2,
        "attributes": {
          "wattage": 1000
        }
      },
      {
        "description": "geyser",
        "quantity": 1,
        "attributes": {
          "brand": "Anchor",
          "issue": "fuse blown"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "chhe ya saat cake butterscotch ek bread 1 kg heart shape vanilla aur do pastry strawberry last time jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "cake",
        "quantity": 6,
        "attributes": {
          "flavour": "butterscotch"
        }
      },
      {
        "description": "bread loaf",
        "quantity": 1,
        "attributes": {
          "weight_kg": 1,
          "shape": "heart",
          "flavour": "vanilla"
        }
      },
      {
        "description": "pastry",
        "quantity": 2,
        "attributes": {
          "flavour": "strawberry"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "neha ke liye teen pajama chest 34 shaadi se pehle": {
    "customer": "Neha",
    "items": [
      {
        "description": "pajama",
        "quantity": 3,
        "attributes": {
          "chest": 34
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "suit २ beige slim chest 38 aur dupatta chhe aadha sleeve agle hafte tak": {
    "customer": null,
    "items": [
      {
        "description": "suit",
        "quantity": 2,
        "attributes": {
          "color": "beige",
          "fit": "slim",
          "chest": 38
        }
      },
      {
        "description": "dupatta",
        "quantity": 6,
        "attributes": {
          "sleeve": "half"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-28",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "poha nahi do dahi normal masala aadha portion jain wala aur do idli 28 sep tak 300 tak": {
    "customer": null,
    "items": [
      {
        "description": "curd",
        "quantity": 2,
        "attributes": {
          "spice_level": "medium",
          "portion": "half",
          "jain": true
        }
      },
      {
        "description": "idli",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-28",
    "amount": 300,
    "references_prior_order": false,
    "confidence": 1
  },
  "rukhsana ke liye nahi sunita ke liye ek chawal aur teen idli 8 roti ke saath dono me 5 din breakfast ke liye": {
    "customer": "Sunita",
    "items": [
      {
        "description": "rice",
        "quantity": 1,
        "attributes": {
          "roti_count": 8
        }
      },
      {
        "description": "idli",
        "quantity": 3,
        "attributes": {
          "roti_count": 8,
          "days": 5,
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ramesh ji २ daal breakfast me aur do rajma 2 din ke liye guruvar ko nahi shukravar ko pehle jaisa hi": {
    "customer": "Ramesh",
    "items": [
      {
        "description": "dal",
        "quantity": 2,
        "attributes": {
          "meal": "breakfast"
        }
      },
      {
        "description": "rajma",
        "quantity": 2,
        "attributes": {
          "days": 2
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-25",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "tarun ke liye nahi asha ke liye ek mcb anchor ka 2000 watt ka fuse ud gaya 8 tarikh tak": {
    "customer": "Asha",
    "items": [
      {
        "description": "mcb",
        "quantity": 1,
        "attributes": {
          "brand": "Anchor",
          "wattage": 2000,
          "issue": "fuse blown"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-11-08",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "kavita ke liye nahi anil ji ke liye ४ daal 2 roti jain lunch me jitna jaldi ho sake 500 tak": {
    "customer": "Anil ji",
    "items": [
      {
        "description": "dal",
        "quantity": 4,
        "attributes": {
          "roti_count": 2,
          "jain": true,
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 500,
    "references_prior_order": false,
    "confidence": 1
  },
  "socket nahi do गीजर dheema chal raha hai aur do वायरिंग fridge point ki band hai 7 sep tak": {
    "customer": null,
    "items": [
      {
        "description": "geyser",
        "quantity": 2,
        "attributes": {
          "issue": "slow"
        }
      },
      {
        "description": "wiring",
        "quantity": 2,
        "attributes": {
          "appliance": "fridge point",
          "issue": "not working"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-07",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do chawal pura portion dinner me aur खिचड़ी 8 roti 11 din tez dinner kal tak pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "rice",
        "quantity": 2,
        "attributes": {
          "portion": "full",
          "meal": "dinner"
        }
      },
      {
        "description": "khichdi",
        "quantity": 1,
        "attributes": {
          "roti_count": 8,
          "days": 11,
          "spice_level": "spicy",
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-14",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "vikram ji sabji aur khichdi chahiye sabji dinner me 3 roti ke saath khichdi breakfast me 9 din ke liye": {
    "customer": "Vikram",
    "items": [
      {
        "description": "sabzi",
        "quantity": 1,
        "attributes": {
          "roti_count": 3,
          "meal": "dinner"
        }
      },
      {
        "description": "khichdi",
        "quantity": 1,
        "attributes": {
          "days": 9,
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "sarita didi ke liye sabji do jain nahi dinner me agle hafte se": {
    "customer": "Sarita didi",
    "items": [
      {
        "description": "sabzi",
        "quantity": 2,
        "attributes": {
          "jain": false,
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-10",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "tarun ke liye blouse nahi ek lehenga chest 34 aur do सलवार bottle green chest 44 parso tak": {
    "customer": "Tarun",
    "items": [
      {
        "description": "lehenga",
        "quantity": 1,
        "attributes": {
          "chest": 34
        }
      },
      {
        "description": "salwar",
        "quantity": 2,
        "attributes": {
          "color": "bottle green",
          "chest": 44
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-21",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ramesh ji kurta nahi chahiye ek koti slim grey chest 38 aur do shalwar chest 40 parso tak": {
    "customer": "Ramesh",
    "items": [
      {
        "description": "waistcoat",
        "quantity": 1,
        "attributes": {
          "fit": "slim",
          "color": "grey",
          "chest": 38
        }
      },
      {
        "description": "salwar",
        "quantity": 2,
        "attributes": {
          "chest": 40
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-01",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "३ cheese cake chocolate urgent hai 24 tarikh tak": {
    "customer": null,
    "items": [
      {
        "description": "cheesecake",
        "quantity": 3,
        "attributes": {
          "flavour": "chocolate"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-24",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do छोले kam mirchi lunch me aur idli zyada portion somvar ko nahi mangalvar ko": {
    "customer": null,
    "items": [
      {
        "description": "chole",
        "quantity": 2,
        "attributes": {
          "spice_level": "mild",
          "meal": "lunch"
        }
      },
      {
        "description": "idli",
        "quantity": 1,
        "attributes": {
          "portion": "extra"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-06",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "gopal ji ke yahan १ वायरिंग bedroom me awaaz aa rahi hai urgent hai parso tak dekh lena pichli baar jaisa": {
    "customer": "Gopal ji",
    "items": [
      {
        "description": "wiring",
        "quantity": 1,
        "attributes": {
          "room": "bedroom",
          "issue": "noise"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-12",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "browni chahiye ek 1 tier ka bas": {
    "customer": null,
    "items": [
      {
        "description": "brownie",
        "quantity": 1,
        "attributes": {
          "tier": 1
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "tube light nahi teen pankha chahiye aaj tak 650 me": {
    "customer": null,
    "items": [
      {
        "description": "ceiling fan",
        "quantity": 3,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-06",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "roti nahi teen thali 10 din ke liye breakfast me is weekend se": {
    "customer": null,
    "items": [
      {
        "description": "thali",
        "quantity": 3,
        "attributes": {
          "days": 10,
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-26",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek wiring karwani hai bathroom me geyser ke liye 23 aug tak": {
    "customer": null,
    "items": [
      {
        "description": "wiring",
        "quantity": 1,
        "attributes": {
          "appliance": "geyser",
          "room": "bathroom"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-08-23",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "bhaiya wahi roz wala bhijwa dena main phone karta hu baad me": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "poha nahi थाली ek roti 5 din breakfast me aur paanch parantha tez 5 roti lunch ke liye १ तारीख tak": {
    "customer": null,
    "items": [
      {
        "description": "thali",
        "quantity": 1,
        "attributes": {}
      },
      {
        "description": "roti",
        "quantity": 1,
        "attributes": {
          "days": 5,
          "meal": "breakfast"
        }
      },
      {
        "description": "paratha",
        "quantity": 5,
        "attributes": {
          "spice_level": "spicy",
          "roti_count": 5,
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-01",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek switchboard aur teen motor light wale dekhne hain pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "switch board",
        "quantity": 1,
        "attributes": {}
      },
      {
        "description": "water motor",
        "quantity": 3,
        "attributes": {
          "appliance": "light"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "farida ji do ya teen राजमा 9 din breakfast me jab ho jaye tab bata dena": {
    "customer": "Farida",
    "items": [
      {
        "description": "rajma",
        "quantity": 2,
        "attributes": {
          "days": 9,
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen sherwani maroon xxl length 40 aur blouse chest 38 somvar ko nahi budhvar ko": {
    "customer": null,
    "items": [
      {
        "description": "sherwani",
        "quantity": 3,
        "attributes": {
          "color": "maroon",
          "size": "XXL",
          "length": 40
        }
      },
      {
        "description": "blouse",
        "quantity": 1,
        "attributes": {
          "chest": 38
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-07",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek sherwani banwana hai agle hafte tak pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "sherwani",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-10",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "manoj bol raha hu wahi wala kaam karwana hai aap samajh gaye hoge pichli baar jaisa nahi is baar naya": {
    "customer": "Manoj",
    "items": [],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "pajama slim maroon chest 46 aur २ lehenga linen length 42 chest 42 agle mahine 1500 tak": {
    "customer": null,
    "items": [
      {
        "description": "pajama",
        "quantity": 1,
        "attributes": {
          "fit": "slim",
          "color": "maroon",
          "chest": 46
        }
      },
      {
        "description": "lehenga",
        "quantity": 2,
        "attributes": {
          "fabric": "linen",
          "length": 42,
          "chest": 42
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 1500,
    "references_prior_order": false,
    "confidence": 1
  },
  "naveen ke liye छोले lunch me pichli baar jaisa nahi is baar naya": {
    "customer": "Naveen",
    "items": [
      {
        "description": "chole",
        "quantity": 1,
        "attributes": {
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "priya ji daal do 8 din ke liye thali ek 6 roti 8 din lunch me aur parantha do kam mirchi dinner ke liye": {
    "customer": "Priya",
    "items": [
      {
        "description": "dal",
        "quantity": 2,
        "attributes": {
          "days": 8
        }
      },
      {
        "description": "thali",
        "quantity": 1,
        "attributes": {
          "roti_count": 6,
          "days": 8,
          "meal": "lunch"
        }
      },
      {
        "description": "paratha",
        "quantity": 2,
        "attributes": {
          "spice_level": "mild",
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen invertor aur ek board lagwana hai invertor polycab ke bathroom me board hall me is weekend tak 1500 tak last wale jaisa": {
    "customer": null,
    "items": [
      {
        "description": "inverter",
        "quantity": 3,
        "attributes": {
          "brand": "Polycab",
          "room": "bathroom"
        }
      },
      {
        "description": "switch board",
        "quantity": 1,
        "attributes": {
          "room": "hall"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-08-22",
    "amount": 1500,
    "references_prior_order": true,
    "confidence": 1
  },
  "tarun ke liye nahi naveen ke liye paneer ki sabji pura portion jain nahi normal masala dinner me": {
    "customer": "Naveen",
    "items": [
      {
        "description": "paneer sabzi",
        "quantity": 1,
        "attributes": {
          "portion": "full",
          "jain": false,
          "spice_level": "medium",
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "pant nahi २ suit loose fitting 650 tak asap chahiye": {
    "customer": null,
    "items": [
      {
        "description": "suit",
        "quantity": 2,
        "attributes": {
          "fit": "loose"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "३ kameez mustard color season shuru hone se pehle pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "kameez",
        "quantity": 3,
        "attributes": {
          "color": "mustard"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "vikram ke liye nahi sarita didi ke liye chawal breakfast me aur ek khichdi aadha tez lunch ke liye aaj tak last time jaisa": {
    "customer": "Sarita didi",
    "items": [
      {
        "description": "rice",
        "quantity": 1,
        "attributes": {
          "meal": "breakfast"
        }
      },
      {
        "description": "khichdi",
        "quantity": 1,
        "attributes": {
          "portion": "half",
          "spice_level": "spicy",
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-26",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "anil ji ke liye muffin char normal ande wale chocolate jitna jaldi ho sake": {
    "customer": "Anil ji",
    "items": [
      {
        "description": "muffin",
        "quantity": 4,
        "attributes": {
          "egg_free": false,
          "flavour": "chocolate"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "muffin nahi do cup cake chahiye next week kabhi bhi de dena": {
    "customer": null,
    "items": [
      {
        "description": "cupcake",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "tarun ke liye switchboard nahi १ सॉकेट 40 watt ka motor wala last wale jaisa": {
    "customer": "Tarun",
    "items": [
      {
        "description": "socket",
        "quantity": 1,
        "attributes": {
          "wattage": 40,
          "appliance": "motor"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "ek शेरवानी length 46 aadha sleeve do pajama xl length 38 beige chest 36 exam ke baad": {
    "customer": null,
    "items": [
      {
        "description": "sherwani",
        "quantity": 1,
        "attributes": {
          "length": 46,
          "sleeve": "half"
        }
      },
      {
        "description": "pajama",
        "quantity": 2,
        "attributes": {
          "size": "XL",
          "length": 38,
          "color": "beige",
          "chest": 36
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "priya ji char ब्लाउज chest chhiyalis jitna jaldi ho sake": {
    "customer": "Priya",
    "items": [
      {
        "description": "blouse",
        "quantity": 4,
        "attributes": {
          "chest": 46
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "deepak bhai paanch cupcake red velvet ek cookie normal ande wala chocolate aur pastry bhi normal ande wali pichli baar jaisa nahi is baar naya": {
    "customer": "Deepak bhai",
    "items": [
      {
        "description": "cupcake",
        "quantity": 5,
        "attributes": {
          "flavour": "red velvet"
        }
      },
      {
        "description": "cookies",
        "quantity": 1,
        "attributes": {
          "egg_free": false,
          "flavour": "chocolate"
        }
      },
      {
        "description": "pastry",
        "quantity": 1,
        "attributes": {
          "egg_free": false
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "deepak bhai ke liye do salwar length chalis aur do pant": {
    "customer": "Deepak bhai",
    "items": [
      {
        "description": "salwar",
        "quantity": 2,
        "attributes": {
          "length": 40
        }
      },
      {
        "description": "pant",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen geyser 80 watt ke": {
    "customer": null,
    "items": [
      {
        "description": "geyser",
        "quantity": 3,
        "attributes": {
          "wattage": 80
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "थाली do 11 din pura portion breakfast me aur idli ek agle hafte se pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "thali",
        "quantity": 2,
        "attributes": {
          "days": 11,
          "portion": "full",
          "meal": "breakfast"
        }
      },
      {
        "description": "idli",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-04",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "pyjama ३ size l 3 4 sleeve": {
    "customer": null,
    "items": [
      {
        "description": "pajama",
        "quantity": 3,
        "attributes": {
          "size": "L",
          "sleeve": "three-quarter"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "iqbal bhai ke yahan १ मोटर saath watt ka jhatka lag raha hai agle hafte tak": {
    "customer": "Iqbal bhai",
    "items": [
      {
        "description": "water motor",
        "quantity": 1,
        "attributes": {
          "wattage": 60,
          "issue": "leaking current"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "२ ac point hall wale 40 watt chal nahi raha aur motor dheema hai mangalvar ko nahi budhvar ko": {
    "customer": null,
    "items": [
      {
        "description": "ac point",
        "quantity": 2,
        "attributes": {
          "wattage": 40,
          "room": "hall",
          "issue": "not working"
        }
      },
      {
        "description": "water motor",
        "quantity": 1,
        "attributes": {
          "issue": "slow"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-02",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "deepak bhai ke liye nahi kavita ke liye ६ bday cake chocolate aur ek ब्रेड 1 5 kg butterscotch narsu tak last time jaisa": {
    "customer": "Kavita",
    "items": [
      {
        "description": "birthday cake",
        "quantity": 6,
        "attributes": {
          "flavour": "chocolate"
        }
      },
      {
        "description": "bread loaf",
        "quantity": 1,
        "attributes": {
          "weight_kg": 1.5,
          "flavour": "butterscotch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-10",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "kavita ji char idli 7 roti lunch me do pohe tez jain nahi aur do khichdi zyada 5 din jab time mile": {
    "customer": "Kavita",
    "items": [
      {
        "description": "idli",
        "quantity": 4,
        "attributes": {
          "roti_count": 7,
          "meal": "lunch"
        }
      },
      {
        "description": "poha",
        "quantity": 2,
        "attributes": {
          "spice_level": "spicy",
          "jain": false
        }
      },
      {
        "description": "khichdi",
        "quantity": 2,
        "attributes": {
          "portion": "extra",
          "days": 5
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "डोनट chahiye 3 tier strawberry urgent hai agle hafte tak pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "donut",
        "quantity": 1,
        "attributes": {
          "tier": 3,
          "flavour": "strawberry"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-20",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "aaj tak bhijwa dena bhaiya 650 tak ka aap hi decide kar lo": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": "2026-10-08",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "bhaiya wo silwana tha jo maine bola tha aap dekh lo": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "tarun ke liye salwar nahi लहंगा regular fit 21 tarikh tak": {
    "customer": "Tarun",
    "items": [
      {
        "description": "lehenga",
        "quantity": 1,
        "attributes": {
          "fit": "regular"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-21",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "paanch invertor bedroom me current aa raha hai aur ek geyser bhi aaj tak 200 tak pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "inverter",
        "quantity": 5,
        "attributes": {
          "room": "bedroom",
          "issue": "leaking current"
        }
      },
      {
        "description": "geyser",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-22",
    "amount": 200,
    "references_prior_order": false,
    "confidence": 1
  },
  "do lehenga chest 44 jaldi tarso tak": {
    "customer": null,
    "items": [
      {
        "description": "lehenga",
        "quantity": 2,
        "attributes": {
          "chest": 44
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-25",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "rajma nahi daal 7 roti ke saath dinner me jaldi bhejna last wale jaisa": {
    "customer": null,
    "items": [
      {
        "description": "dal",
        "quantity": 1,
        "attributes": {
          "roti_count": 7,
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "teen ya char ghanti aur do ac point se awaaz aa rahi hai kal tak 450 tak": {
    "customer": null,
    "items": [
      {
        "description": "doorbell",
        "quantity": 3,
        "attributes": {}
      },
      {
        "description": "ac point",
        "quantity": 2,
        "attributes": {
          "issue": "noise"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-17",
    "amount": 450,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek wiring crompton ki awaaz kar rahi hai do ghanti balcony wali usha ki dheema chal rahi jaldi 7 din me 650 tak": {
    "customer": null,
    "items": [
      {
        "description": "wiring",
        "quantity": 1,
        "attributes": {
          "brand": "Crompton",
          "issue": "noise"
        }
      },
      {
        "description": "doorbell",
        "quantity": 2,
        "attributes": {
          "room": "balcony",
          "brand": "Usha",
          "issue": "slow"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-17",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "is weekend tak bhijwa dena aap samajh gaye na kya chahiye": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": "2026-08-29",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "५ muffin aur ek cake 1 tier mango jaldi chahiye agle hafte tak": {
    "customer": null,
    "items": [
      {
        "description": "muffin",
        "quantity": 5,
        "attributes": {}
      },
      {
        "description": "cake",
        "quantity": 1,
        "attributes": {
          "tier": 1,
          "flavour": "mango"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-05",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "lehenga 3 4 sleeve silk ka 18 sep tak pichli baar jaisa": {
    "customer": null,
    "items": [
      {
        "description": "lehenga",
        "quantity": 1,
        "attributes": {
          "sleeve": "three-quarter",
          "fabric": "silk"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-18",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "narsu tak wahi bhijwa dena 200 ka last time jaisa": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": "2026-08-24",
    "amount": 200,
    "references_prior_order": true,
    "confidence": 1
  },
  "deepak bhai पेस्ट्री teen 3 kg 3 tier chocolate aur bday cake paanch 200 tak": {
    "customer": "Deepak bhai",
    "items": [
      {
        "description": "pastry",
        "quantity": 3,
        "attributes": {
          "weight_kg": 3,
          "tier": 3,
          "flavour": "chocolate"
        }
      },
      {
        "description": "birthday cake",
        "quantity": 5,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": 200,
    "references_prior_order": false,
    "confidence": 1
  },
  "२ दाल 8 roti aadha portion breakfast me thoda jaldi agle hafte se": {
    "customer": null,
    "items": [
      {
        "description": "dal",
        "quantity": 2,
        "attributes": {
          "roti_count": 8,
          "portion": "half",
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-26",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "wiring 80 watt me chingari aur paanch socket 1000 watt ac wale bhi spark kar raha hai budhvar ko nahi ravivar ko": {
    "customer": null,
    "items": [
      {
        "description": "wiring",
        "quantity": 1,
        "attributes": {
          "wattage": 80,
          "issue": "spark"
        }
      },
      {
        "description": "socket",
        "quantity": 5,
        "attributes": {
          "wattage": 1000,
          "appliance": "ac",
          "issue": "spark"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-04",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "brownie nahi meena aunty ke liye cheese cake agle hafte tak": {
    "customer": "Meena aunty",
    "items": [
      {
        "description": "cheesecake",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-08-31",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "gopal ji pohe do lunch me jab ho jaye bata dena": {
    "customer": "Gopal ji",
    "items": [
      {
        "description": "poha",
        "quantity": 2,
        "attributes": {
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "gopal ji ke liye nahi rakesh ke liye do parantha 13 din ke liye jain 1200 tak": {
    "customer": "Rakesh",
    "items": [
      {
        "description": "paratha",
        "quantity": 2,
        "attributes": {
          "days": 13,
          "jain": true
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": 1200,
    "references_prior_order": false,
    "confidence": 1
  },
  "dupatta waist 28 diwali se pehle": {
    "customer": null,
    "items": [
      {
        "description": "dupatta",
        "quantity": 1,
        "attributes": {
          "waist": 28
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "sunita ke liye nahi anil ji ke liye ek pastry 3 tier butterscotch २२ तारीख tak": {
    "customer": "Anil ji",
    "items": [
      {
        "description": "pastry",
        "quantity": 1,
        "attributes": {
          "tier": 3,
          "flavour": "butterscotch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "socket nahi do ghanti orient ki fan wale point pe lagani hai": {
    "customer": null,
    "items": [
      {
        "description": "doorbell",
        "quantity": 2,
        "attributes": {
          "brand": "Orient",
          "appliance": "fan"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "kavita ji teen daal zyada breakfast me ek rajma 6 din 2 roti jain nahi breakfast aur chawal 7 roti dinner me 11 oct tak pichli baar jaisa nahi is baar naya": {
    "customer": "Kavita",
    "items": [
      {
        "description": "dal",
        "quantity": 3,
        "attributes": {
          "portion": "extra",
          "meal": "breakfast"
        }
      },
      {
        "description": "rajma",
        "quantity": 1,
        "attributes": {
          "days": 6,
          "roti_count": 2,
          "jain": false,
          "meal": "breakfast"
        }
      },
      {
        "description": "rice",
        "quantity": 1,
        "attributes": {
          "roti_count": 7,
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-11",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "manoj ji kurta grey size s chest 46 aur teen lehenga chest 36 urgent 25 aug tak 450 tak": {
    "customer": "Manoj",
    "items": [
      {
        "description": "kurta",
        "quantity": 1,
        "attributes": {
          "color": "grey",
          "size": "S",
          "chest": 46
        }
      },
      {
        "description": "lehenga",
        "quantity": 3,
        "attributes": {
          "chest": 36
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-25",
    "amount": 450,
    "references_prior_order": false,
    "confidence": 1
  },
  "vikram ke liye nahi kavita ke liye do fuse box crompton ke motor wale awaaz kar rahe hain": {
    "customer": "Kavita",
    "items": [
      {
        "description": "mcb",
        "quantity": 2,
        "attributes": {
          "brand": "Crompton",
          "appliance": "motor",
          "issue": "noise"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen pastry normal ande wali 1 kg heart shape red velvet festival se pehle chahiye pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "pastry",
        "quantity": 3,
        "attributes": {
          "egg_free": false,
          "weight_kg": 1,
          "shape": "heart",
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "brownie nahi do muffin 3 kg chocolate kal tak 650 me": {
    "customer": null,
    "items": [
      {
        "description": "muffin",
        "quantity": 2,
        "attributes": {
          "weight_kg": 3,
          "flavour": "chocolate"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-29",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "iqbal bhai १ pankha kitchen me aur teen tubelight 1000 watt spark kar raha hai agle mahine": {
    "customer": "Iqbal bhai",
    "items": [
      {
        "description": "ceiling fan",
        "quantity": 1,
        "attributes": {
          "room": "kitchen"
        }
      },
      {
        "description": "tube light",
        "quantity": 3,
        "attributes": {
          "wattage": 1000,
          "issue": "spark"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "manoj ji do suit length 46 linen chest 46 urgent hai 4 din me": {
    "customer": "Manoj",
    "items": [
      {
        "description": "suit",
        "quantity": 2,
        "attributes": {
          "length": 46,
          "fabric": "linen",
          "chest": 46
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-15",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "rakesh ke liye nahi priya ke liye cup cake 2 tier red velvet aaj tak": {
    "customer": "Priya",
    "items": [
      {
        "description": "cupcake",
        "quantity": 1,
        "attributes": {
          "tier": 2,
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-09",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ब्लाउज slim fit chest chavalis": {
    "customer": null,
    "items": [
      {
        "description": "blouse",
        "quantity": 1,
        "attributes": {
          "fit": "slim",
          "chest": 44
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "neha ke yahan do ya teen gizer 60 watt awaaz kar rahe aur inverter fridge point ka polycab band hai pehle jaisa hi": {
    "customer": "Neha",
    "items": [
      {
        "description": "geyser",
        "quantity": 2,
        "attributes": {
          "wattage": 60,
          "issue": "noise"
        }
      },
      {
        "description": "inverter",
        "quantity": 1,
        "attributes": {
          "appliance": "fridge point",
          "brand": "Polycab",
          "issue": "not working"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "deepak bhai ६ kurta chest 42 jaldi chahiye 22 sep tak": {
    "customer": "Deepak bhai",
    "items": [
      {
        "description": "kurta",
        "quantity": 6,
        "attributes": {
          "chest": 42
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "dal nahi ek dahi kam mirchi dinner me teen khichdi 14 din jain dinner parso tak": {
    "customer": null,
    "items": [
      {
        "description": "curd",
        "quantity": 1,
        "attributes": {
          "spice_level": "mild",
          "meal": "dinner"
        }
      },
      {
        "description": "khichdi",
        "quantity": 3,
        "attributes": {
          "days": 14,
          "jain": true,
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-24",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "anil ji ke liye nahi kavita ke liye do motor ka fuse ud gaya teen wiring ac wali polycab me current aa raha aur do घंटी me bhi jhatka lag raha hai": {
    "customer": "Kavita",
    "items": [
      {
        "description": "water motor",
        "quantity": 2,
        "attributes": {
          "issue": "fuse blown"
        }
      },
      {
        "description": "wiring",
        "quantity": 3,
        "attributes": {
          "appliance": "ac",
          "brand": "Polycab",
          "issue": "leaking current"
        }
      },
      {
        "description": "doorbell",
        "quantity": 2,
        "attributes": {
          "issue": "leaking current"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do browni 2 tier ke shaadi se pehle": {
    "customer": null,
    "items": [
      {
        "description": "brownie",
        "quantity": 2,
        "attributes": {
          "tier": 2
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "roti nahi char parantha bhijwa dena": {
    "customer": null,
    "items": [
      {
        "description": "paratha",
        "quantity": 4,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen cupcake eggless 1 kg red velvet 250 tak pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "cupcake",
        "quantity": 3,
        "attributes": {
          "egg_free": true,
          "weight_kg": 1,
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": 250,
    "references_prior_order": false,
    "confidence": 1
  },
  "manoj ji ek लहंगा aadha sleeve loose chest chhiyalis aur do kameez parso tak": {
    "customer": "Manoj",
    "items": [
      {
        "description": "lehenga",
        "quantity": 1,
        "attributes": {
          "sleeve": "half",
          "fit": "loose",
          "chest": 46
        }
      },
      {
        "description": "kameez",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-01",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do lehnga chest 40 guruvar ko nahi shukravar ko": {
    "customer": null,
    "items": [
      {
        "description": "lehenga",
        "quantity": 2,
        "attributes": {
          "chest": 40
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-11",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "sunita ke liye roti nahi sirf इडली is weekend tak last time jaisa": {
    "customer": "Sunita",
    "items": [
      {
        "description": "idli",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-22",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "shalini ke liye kameez ek pura sleeve regular fit aur kurta char size s 3 din me": {
    "customer": "Shalini",
    "items": [
      {
        "description": "kameez",
        "quantity": 1,
        "attributes": {
          "sleeve": "full",
          "fit": "regular"
        }
      },
      {
        "description": "kurta",
        "quantity": 4,
        "attributes": {
          "size": "S"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-19",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "kavita ji ek chawal aur do idli chawal jain 7 roti lunch me 17 tarikh tak 800 tak pichli baar jaisa": {
    "customer": "Kavita",
    "items": [
      {
        "description": "rice",
        "quantity": 1,
        "attributes": {
          "jain": true,
          "roti_count": 7,
          "meal": "lunch"
        }
      },
      {
        "description": "idli",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-17",
    "amount": 800,
    "references_prior_order": true,
    "confidence": 1
  },
  "paanch bread ek cupcake aur ek doughnut bread eggless cupcake 1 kg doughnut square 0 5 kg red velvet agle hafte tak last wale jaisa": {
    "customer": null,
    "items": [
      {
        "description": "bread loaf",
        "quantity": 5,
        "attributes": {
          "egg_free": true
        }
      },
      {
        "description": "cupcake",
        "quantity": 1,
        "attributes": {
          "weight_kg": 1
        }
      },
      {
        "description": "donut",
        "quantity": 1,
        "attributes": {
          "shape": "square",
          "weight_kg": 0.5,
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-19",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "डोनट 3 kg pineapple mahine ke end tak": {
    "customer": null,
    "items": [
      {
        "description": "donut",
        "quantity": 1,
        "attributes": {
          "weight_kg": 3,
          "flavour": "pineapple"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "pajama nahi kurta pura sleeve aaj tak pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "kurta",
        "quantity": 1,
        "attributes": {
          "sleeve": "full"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-23",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "naveen ke liye do ya teen salwar pura sleeve chest 42 4 din me 200 tak": {
    "customer": "Naveen",
    "items": [
      {
        "description": "salwar",
        "quantity": 2,
        "attributes": {
          "sleeve": "full",
          "chest": 42
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-10-01",
    "amount": 200,
    "references_prior_order": false,
    "confidence": 1
  },
  "पेस्ट्री 3 tier eggless teen bday cake 1 tier 1 5 kg red velvet somvar ko nahi mangalvar ko": {
    "customer": null,
    "items": [
      {
        "description": "pastry",
        "quantity": 1,
        "attributes": {
          "tier": 3,
          "egg_free": true
        }
      },
      {
        "description": "birthday cake",
        "quantity": 3,
        "attributes": {
          "tier": 1,
          "weight_kg": 1.5,
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-25",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "kurta nahi kameez 3 4 sleeve 6 tarikh tak": {
    "customer": null,
    "items": [
      {
        "description": "kameez",
        "quantity": 1,
        "attributes": {
          "sleeve": "three-quarter"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-06",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "cookies nahi ek muffin 0 5 kg square 3 tier chocolate char doughnut 2 tier chocolate narsu tak last time jaisa": {
    "customer": null,
    "items": [
      {
        "description": "muffin",
        "quantity": 1,
        "attributes": {
          "weight_kg": 0.5,
          "shape": "square",
          "tier": 3,
          "flavour": "chocolate"
        }
      },
      {
        "description": "donut",
        "quantity": 4,
        "attributes": {
          "tier": 2,
          "flavour": "chocolate"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-25",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "vikram ji bread normal ande wala mango aur doughnut do normal ande wale 3 tier mango agle hafte tak": {
    "customer": "Vikram",
    "items": [
      {
        "description": "bread loaf",
        "quantity": 1,
        "attributes": {
          "egg_free": false,
          "flavour": "mango"
        }
      },
      {
        "description": "donut",
        "quantity": 2,
        "attributes": {
          "egg_free": false,
          "tier": 3,
          "flavour": "mango"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-13",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "farida ke liye nahi naveen ke liye teen doughnut eggless round vanilla": {
    "customer": "Naveen",
    "items": [
      {
        "description": "donut",
        "quantity": 3,
        "attributes": {
          "egg_free": true,
          "shape": "round",
          "flavour": "vanilla"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "४ ac point usha ke fridge point wale 80 watt dheema chal raha १ switchboard light ka 80 watt jaldi chahiye 15 sep tak last wale jaisa": {
    "customer": null,
    "items": [
      {
        "description": "ac point",
        "quantity": 4,
        "attributes": {
          "brand": "Usha",
          "appliance": "fridge point",
          "wattage": 80,
          "issue": "slow"
        }
      },
      {
        "description": "switch board",
        "quantity": 1,
        "attributes": {
          "appliance": "light",
          "wattage": 80
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-15",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "tarun ke liye pant chest 46 guruvar ko nahi shukravar ko": {
    "customer": "Tarun",
    "items": [
      {
        "description": "pant",
        "quantity": 1,
        "attributes": {
          "chest": 46
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-25",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "deepak bhai ke liye nahi shalini ke liye शर्ट silwana hai": {
    "customer": "Shalini",
    "items": [
      {
        "description": "shirt",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen wiring bathroom me assi watt ki tarso tak": {
    "customer": null,
    "items": [
      {
        "description": "wiring",
        "quantity": 3,
        "attributes": {
          "wattage": 80,
          "room": "bathroom"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-08-25",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "meena aunty ke liye paanch dupatta slim chest 46 mahine ke end tak last wale jaisa": {
    "customer": "Meena aunty",
    "items": [
      {
        "description": "dupatta",
        "quantity": 5,
        "attributes": {
          "fit": "slim",
          "chest": 46
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "khichdi nahi roti 5 din ke liye 2 roti zyada rakhna १ parantha breakfast me aur rajma 6 din dinner me": {
    "customer": null,
    "items": [
      {
        "description": "roti",
        "quantity": 1,
        "attributes": {
          "days": 5,
          "roti_count": 2,
          "portion": "extra"
        }
      },
      {
        "description": "paratha",
        "quantity": 1,
        "attributes": {
          "meal": "breakfast"
        }
      },
      {
        "description": "rajma",
        "quantity": 1,
        "attributes": {
          "days": 6,
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "salwar length bayalis chest 40 tarso tak": {
    "customer": null,
    "items": [
      {
        "description": "salwar",
        "quantity": 1,
        "attributes": {
          "length": 42,
          "chest": 40
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-16",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "iqbal bhai ke liye थाली lunch me pehle jaisa hi": {
    "customer": "Iqbal bhai",
    "items": [
      {
        "description": "thali",
        "quantity": 1,
        "attributes": {
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "teen pant chahiye jaldi chahiye narsu tak": {
    "customer": null,
    "items": [
      {
        "description": "pant",
        "quantity": 3,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-14",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "thali breakfast me 11 sep tak": {
    "customer": null,
    "items": [
      {
        "description": "thali",
        "quantity": 1,
        "attributes": {
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-11",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "tarso tak bhijwa dena bhaiya aap jaante ho kya": {
    "customer": null,
    "items": [],
    "needs_clarification": true,
    "due_date": "2026-09-15",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "muffin nahi do cheese cake square pineapple": {
    "customer": null,
    "items": [
      {
        "description": "cheesecake",
        "quantity": 2,
        "attributes": {
          "shape": "square",
          "flavour": "pineapple"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "invertor do geyser wale 80 watt ke 21 tarikh tak": {
    "customer": null,
    "items": [
      {
        "description": "inverter",
        "quantity": 2,
        "attributes": {
          "appliance": "geyser",
          "wattage": 80
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-21",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "३ ya ४ pohe aur do idli dinner me festival se pehle chahiye": {
    "customer": null,
    "items": [
      {
        "description": "poha",
        "quantity": 3,
        "attributes": {}
      },
      {
        "description": "idli",
        "quantity": 2,
        "attributes": {
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "sunita ji ek doughnut aur do cookies doughnut 2 kg butterscotch cookies 2 kg urgent hai": {
    "customer": "Sunita",
    "items": [
      {
        "description": "donut",
        "quantity": 1,
        "attributes": {
          "weight_kg": 2,
          "flavour": "butterscotch"
        }
      },
      {
        "description": "cookies",
        "quantity": 2,
        "attributes": {
          "weight_kg": 2
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "mcb bathroom wala fuse ud gaya urgent narsu tak": {
    "customer": null,
    "items": [
      {
        "description": "mcb",
        "quantity": 1,
        "attributes": {
          "room": "bathroom",
          "issue": "fuse blown"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-17",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "gopal ji paanch sherwani 3 4 sleeve size m silk chest 34 aur salwar silk size l somvar ko nahi mangalvar ko": {
    "customer": "Gopal ji",
    "items": [
      {
        "description": "sherwani",
        "quantity": 5,
        "attributes": {
          "sleeve": "three-quarter",
          "size": "M",
          "fabric": "silk",
          "chest": 34
        }
      },
      {
        "description": "salwar",
        "quantity": 1,
        "attributes": {
          "fabric": "silk",
          "size": "L"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-13",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do fuse box assi watt ke fan wale": {
    "customer": null,
    "items": [
      {
        "description": "mcb",
        "quantity": 2,
        "attributes": {
          "wattage": 80,
          "appliance": "fan"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "१ cookie aur ek doughnut cookie eggless red velvet doughnut eggless heart shape pineapple last time jaisa": {
    "customer": null,
    "items": [
      {
        "description": "cookies",
        "quantity": 1,
        "attributes": {
          "egg_free": true,
          "flavour": "red velvet"
        }
      },
      {
        "description": "donut",
        "quantity": 1,
        "attributes": {
          "egg_free": true,
          "shape": "heart",
          "flavour": "pineapple"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "do switchboard lagwane hain pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "switch board",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "teen kurta chest 44 urgent hai 4 oct tak": {
    "customer": null,
    "items": [
      {
        "description": "kurta",
        "quantity": 3,
        "attributes": {
          "chest": 44
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-04",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "rukhsana ke liye nahi farida ke liye chimney fan kitchen ka light ka fuse ud gaya 10 oct tak": {
    "customer": "Farida",
    "items": [
      {
        "description": "exhaust fan",
        "quantity": 1,
        "attributes": {
          "room": "kitchen",
          "appliance": "light",
          "issue": "fuse blown"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-10",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "meena aunty ek chhole normal masala 4 roti dinner me teen paneer lunch ke liye aur do daal normal zyada jaldi chahiye is weekend se": {
    "customer": "Meena aunty",
    "items": [
      {
        "description": "chole",
        "quantity": 1,
        "attributes": {
          "spice_level": "medium",
          "roti_count": 4,
          "meal": "dinner"
        }
      },
      {
        "description": "paneer sabzi",
        "quantity": 3,
        "attributes": {
          "meal": "lunch"
        }
      },
      {
        "description": "dal",
        "quantity": 2,
        "attributes": {
          "spice_level": "medium",
          "portion": "extra"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "२ dupatta teen शेरवानी mustard aadha sleeve chest chalis chhe pant chiffon length 40 chest 46 19 sep tak last wale jaisa": {
    "customer": null,
    "items": [
      {
        "description": "dupatta",
        "quantity": 2,
        "attributes": {}
      },
      {
        "description": "sherwani",
        "quantity": 3,
        "attributes": {
          "color": "mustard",
          "sleeve": "half",
          "chest": 40
        }
      },
      {
        "description": "pant",
        "quantity": 6,
        "attributes": {
          "fabric": "chiffon",
          "length": 40,
          "chest": 46
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-19",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "priya ji chole nahi roti tez lunch me aur rajma 7 din dinner me is weekend se": {
    "customer": "Priya",
    "items": [
      {
        "description": "roti",
        "quantity": 1,
        "attributes": {
          "spice_level": "spicy",
          "meal": "lunch"
        }
      },
      {
        "description": "rajma",
        "quantity": 1,
        "attributes": {
          "days": 7,
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-22",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek khichdi aur chhe chhole khichdi 5 roti 3 din breakfast me chhole lunch ke liye": {
    "customer": null,
    "items": [
      {
        "description": "khichdi",
        "quantity": 1,
        "attributes": {
          "roti_count": 5,
          "days": 3,
          "meal": "breakfast"
        }
      },
      {
        "description": "chole",
        "quantity": 6,
        "attributes": {
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek cookie 2 tier vanilla tarso tak": {
    "customer": null,
    "items": [
      {
        "description": "cookies",
        "quantity": 1,
        "attributes": {
          "tier": 2,
          "flavour": "vanilla"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-27",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek bday cake butterscotch aur paanch cupcake pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "birthday cake",
        "quantity": 1,
        "attributes": {
          "flavour": "butterscotch"
        }
      },
      {
        "description": "cupcake",
        "quantity": 5,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "vikram ke liye nahi naveen ke liye paneer tez aur do dahi kam mirchi pura portion": {
    "customer": "Naveen",
    "items": [
      {
        "description": "paneer sabzi",
        "quantity": 1,
        "attributes": {
          "spice_level": "spicy"
        }
      },
      {
        "description": "curd",
        "quantity": 2,
        "attributes": {
          "spice_level": "mild",
          "portion": "full"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen exaust fan usha ke fan se awaaz aa rahi aur tubelight chalis watt ka": {
    "customer": null,
    "items": [
      {
        "description": "exhaust fan",
        "quantity": 3,
        "attributes": {
          "appliance": "fan",
          "brand": "Usha",
          "issue": "noise"
        }
      },
      {
        "description": "tube light",
        "quantity": 1,
        "attributes": {
          "wattage": 40
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "shalini ji teen ya char daal 8 din 7 roti dinner me asap chahiye": {
    "customer": "Shalini",
    "items": [
      {
        "description": "dal",
        "quantity": 3,
        "attributes": {
          "days": 8,
          "roti_count": 7,
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "shalini ke liye ४ suit somvar ko nahi mangalvar ko": {
    "customer": "Shalini",
    "items": [
      {
        "description": "suit",
        "quantity": 4,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-29",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "priya ji tubelight anchor ka bathroom me dheema hai 8 din me pichli baar jaisa nahi is baar naya": {
    "customer": "Priya",
    "items": [
      {
        "description": "tube light",
        "quantity": 1,
        "attributes": {
          "brand": "Anchor",
          "room": "bathroom",
          "issue": "slow"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-04",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "rakesh ji do dupatta length aadtis waist 40 chest 38": {
    "customer": "Rakesh",
    "items": [
      {
        "description": "dupatta",
        "quantity": 2,
        "attributes": {
          "length": 38,
          "waist": 40,
          "chest": 38
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "neha ji do cheese cake heart 1 tier 0 5 kg coffee aur teen bread 2 tier red velvet urgent tarso tak": {
    "customer": "Neha",
    "items": [
      {
        "description": "cheesecake",
        "quantity": 2,
        "attributes": {
          "shape": "heart",
          "tier": 1,
          "weight_kg": 0.5,
          "flavour": "coffee"
        }
      },
      {
        "description": "bread loaf",
        "quantity": 3,
        "attributes": {
          "tier": 2,
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-18",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "naveen ji do sabji zyada dinner me aur char thali pura portion lunch me urgent hai is weekend se 650 tak": {
    "customer": "Naveen",
    "items": [
      {
        "description": "sabzi",
        "quantity": 2,
        "attributes": {
          "portion": "extra",
          "meal": "dinner"
        }
      },
      {
        "description": "thali",
        "quantity": 4,
        "attributes": {
          "portion": "full",
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-22",
    "amount": 650,
    "references_prior_order": false,
    "confidence": 1
  },
  "kavita ji do thali 5 din jain 6 roti lunch me agle mahine 800 tak": {
    "customer": "Kavita",
    "items": [
      {
        "description": "thali",
        "quantity": 2,
        "attributes": {
          "days": 5,
          "jain": true,
          "roti_count": 6,
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 800,
    "references_prior_order": false,
    "confidence": 1
  },
  "ramesh ji ke liye ghanti bajaj ki narsu tak pichli baar jaisa": {
    "customer": "Ramesh",
    "items": [
      {
        "description": "doorbell",
        "quantity": 1,
        "attributes": {
          "brand": "Bajaj"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-08-18",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "paanch bday cake pineapple do kek strawberry paanch ब्रेड normal ande wale vanilla urgent aaj tak": {
    "customer": null,
    "items": [
      {
        "description": "birthday cake",
        "quantity": 5,
        "attributes": {
          "flavour": "pineapple"
        }
      },
      {
        "description": "cake",
        "quantity": 2,
        "attributes": {
          "flavour": "strawberry"
        }
      },
      {
        "description": "bread loaf",
        "quantity": 5,
        "attributes": {
          "egg_free": false,
          "flavour": "vanilla"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-17",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek salwar size l waist 36 chest 40 aur ek pant white khadi chest 34 somvar ko nahi budhvar ko 800 tak last wale jaisa": {
    "customer": null,
    "items": [
      {
        "description": "salwar",
        "quantity": 1,
        "attributes": {
          "size": "L",
          "waist": 36,
          "chest": 40
        }
      },
      {
        "description": "pant",
        "quantity": 1,
        "attributes": {
          "color": "white",
          "fabric": "khadi",
          "chest": 34
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-23",
    "amount": 800,
    "references_prior_order": true,
    "confidence": 1
  },
  "teen kameez chest 38 ek pant 3 4 sleeve do suit xl chest 34 season shuru hone se pehle": {
    "customer": null,
    "items": [
      {
        "description": "kameez",
        "quantity": 3,
        "attributes": {
          "chest": 38
        }
      },
      {
        "description": "pant",
        "quantity": 1,
        "attributes": {
          "sleeve": "three-quarter"
        }
      },
      {
        "description": "suit",
        "quantity": 2,
        "attributes": {
          "size": "XL",
          "chest": 34
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "manoj ke liye nahi tarun ke liye ४ pankha orient ke 650 tak pichli baar jaisa": {
    "customer": "Tarun",
    "items": [
      {
        "description": "ceiling fan",
        "quantity": 4,
        "attributes": {
          "brand": "Orient"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 650,
    "references_prior_order": true,
    "confidence": 1
  },
  "gizer char fridge point ke bedroom me chingari nikal rahi hai": {
    "customer": null,
    "items": [
      {
        "description": "geyser",
        "quantity": 4,
        "attributes": {
          "appliance": "fridge point",
          "room": "bedroom",
          "issue": "spark"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "asha ke liye nahi shalini ke liye ब्राउनी 2 tier aur ५ bday cake 500 tak": {
    "customer": "Shalini",
    "items": [
      {
        "description": "brownie",
        "quantity": 1,
        "attributes": {
          "tier": 2
        }
      },
      {
        "description": "birthday cake",
        "quantity": 5,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": 500,
    "references_prior_order": false,
    "confidence": 1
  },
  "priya ke liye do bday cake square shape 17 tarikh tak pichli baar jaisa nahi is baar naya": {
    "customer": "Priya",
    "items": [
      {
        "description": "birthday cake",
        "quantity": 2,
        "attributes": {
          "shape": "square"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-10-17",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "suit waist battis length 44 chest 44 last time jaisa": {
    "customer": null,
    "items": [
      {
        "description": "suit",
        "quantity": 1,
        "attributes": {
          "waist": 32,
          "length": 44,
          "chest": 44
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "switchboard paanch orient ke fridge point wale bathroom me short ho gaya aur ट्यूब लाइट 80 watt bathroom ka dheema hai": {
    "customer": null,
    "items": [
      {
        "description": "switch board",
        "quantity": 5,
        "attributes": {
          "brand": "Orient",
          "appliance": "fridge point",
          "room": "bathroom",
          "issue": "short circuit"
        }
      },
      {
        "description": "tube light",
        "quantity": 1,
        "attributes": {
          "wattage": 80,
          "room": "bathroom",
          "issue": "slow"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "cheese cake २ round is weekend tak": {
    "customer": null,
    "items": [
      {
        "description": "cheesecake",
        "quantity": 2,
        "attributes": {
          "shape": "round"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-05",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek cookie 3 tier tarso tak pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "cookies",
        "quantity": 1,
        "attributes": {
          "tier": 3
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-25",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "naveen ke liye teen kurta khadi chest aadtis is weekend tak": {
    "customer": "Naveen",
    "items": [
      {
        "description": "kurta",
        "quantity": 3,
        "attributes": {
          "fabric": "khadi",
          "chest": 38
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-12",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "iqbal bhai ke liye nahi sunita ke liye पेस्ट्री chahiye jaldi bhej dena": {
    "customer": "Sunita",
    "items": [
      {
        "description": "pastry",
        "quantity": 1,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "deepak bhai ke liye cake nahi sirf do muffin strawberry 4 tarikh tak": {
    "customer": "Deepak bhai",
    "items": [
      {
        "description": "muffin",
        "quantity": 2,
        "attributes": {
          "flavour": "strawberry"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-04",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "pastry nahi naveen ke liye १ bday cake 1 tier strawberry next week kabhi bhi de dena": {
    "customer": "Naveen",
    "items": [
      {
        "description": "birthday cake",
        "quantity": 1,
        "attributes": {
          "tier": 1,
          "flavour": "strawberry"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "१ idli ek paneer aur paanch thali paneer 4 din normal masala breakfast me thali zyada portion 4 roti parso tak": {
    "customer": null,
    "items": [
      {
        "description": "idli",
        "quantity": 1,
        "attributes": {}
      },
      {
        "description": "paneer sabzi",
        "quantity": 1,
        "attributes": {
          "days": 4,
          "spice_level": "medium",
          "meal": "breakfast"
        }
      },
      {
        "description": "thali",
        "quantity": 5,
        "attributes": {
          "portion": "extra",
          "roti_count": 4
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-24",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "socket nahi teen exaust fan geyser wale current aa raha hai 200 tak": {
    "customer": null,
    "items": [
      {
        "description": "exhaust fan",
        "quantity": 3,
        "attributes": {
          "appliance": "geyser",
          "issue": "leaking current"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": 200,
    "references_prior_order": false,
    "confidence": 1
  },
  "rakesh ji छोले jain nahi 8 roti ke saath diwali se pehle": {
    "customer": "Rakesh",
    "items": [
      {
        "description": "chole",
        "quantity": 1,
        "attributes": {
          "jain": false,
          "roti_count": 8
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen paneer aur ६ खिचड़ी paneer 13 din breakfast me khichdi 4 roti normal masala dinner me agle hafte se": {
    "customer": null,
    "items": [
      {
        "description": "paneer sabzi",
        "quantity": 3,
        "attributes": {
          "days": 13,
          "meal": "breakfast"
        }
      },
      {
        "description": "khichdi",
        "quantity": 6,
        "attributes": {
          "roti_count": 4,
          "spice_level": "medium",
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-06",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek shart 3 4 sleeve": {
    "customer": null,
    "items": [
      {
        "description": "shirt",
        "quantity": 1,
        "attributes": {
          "sleeve": "three-quarter"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "lehenga do linen aadha sleeve chest 34 pyjama do chest 42 aur suit do velvet maroon chest 42 tarso tak": {
    "customer": null,
    "items": [
      {
        "description": "lehenga",
        "quantity": 2,
        "attributes": {
          "fabric": "linen",
          "sleeve": "half",
          "chest": 34
        }
      },
      {
        "description": "pajama",
        "quantity": 2,
        "attributes": {
          "chest": 42
        }
      },
      {
        "description": "suit",
        "quantity": 2,
        "attributes": {
          "fabric": "velvet",
          "color": "maroon",
          "chest": 42
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-09",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "ek पराठा dinner me jitna jaldi ho sake pehle jaisa hi": {
    "customer": null,
    "items": [
      {
        "description": "paratha",
        "quantity": 1,
        "attributes": {
          "meal": "dinner"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "sherwani length 46 3 4 sleeve waist 36 aur paanch dupatta xxl jaldi chahiye agle hafte tak 1200 tak": {
    "customer": null,
    "items": [
      {
        "description": "sherwani",
        "quantity": 1,
        "attributes": {
          "length": 46,
          "sleeve": "three-quarter",
          "waist": 36
        }
      },
      {
        "description": "dupatta",
        "quantity": 5,
        "attributes": {
          "size": "XXL"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-25",
    "amount": 1200,
    "references_prior_order": false,
    "confidence": 1
  },
  "teen koti size xl pura sleeve chest bayalis": {
    "customer": null,
    "items": [
      {
        "description": "waistcoat",
        "quantity": 3,
        "attributes": {
          "size": "XL",
          "sleeve": "full",
          "chest": 42
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "deepak bhai ke liye nahi meena aunty ke liye char pastry normal ande wali 1 tier pineapple agle hafte tak": {
    "customer": "Meena aunty",
    "items": [
      {
        "description": "pastry",
        "quantity": 4,
        "attributes": {
          "egg_free": false,
          "tier": 1,
          "flavour": "pineapple"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-08-31",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "cake nahi ek bread mango wala last time jaisa": {
    "customer": null,
    "items": [
      {
        "description": "bread loaf",
        "quantity": 1,
        "attributes": {
          "flavour": "mango"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "sabzi nahi sunita ji २ थाली 4 sep tak pichli baar jaisa": {
    "customer": "Sunita",
    "items": [
      {
        "description": "thali",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-04",
    "amount": null,
    "references_prior_order": true,
    "confidence": 1
  },
  "sarita didi ke liye nahi shalini ke liye cheese cake aur ek cookie 3 tier square २० तारीख tak": {
    "customer": "Shalini",
    "items": [
      {
        "description": "cheesecake",
        "quantity": 1,
        "attributes": {}
      },
      {
        "description": "cookies",
        "quantity": 1,
        "attributes": {
          "tier": 3,
          "shape": "square"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-20",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "rakesh ji do ya teen dupatta 3 4 sleeve bottle green chest 36": {
    "customer": "Rakesh",
    "items": [
      {
        "description": "dupatta",
        "quantity": 2,
        "attributes": {
          "sleeve": "three-quarter",
          "color": "bottle green",
          "chest": 36
        }
      }
    ],
    "needs_clarification": true,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "asha ji ६ mcb bedroom ke 80 watt chal nahi raha aur २ wiring bajaj ki ac wali se awaaz aa rahi hai urgent 7 din me": {
    "customer": "Asha",
    "items": [
      {
        "description": "mcb",
        "quantity": 6,
        "attributes": {
          "room": "bedroom",
          "wattage": 80,
          "issue": "not working"
        }
      },
      {
        "description": "wiring",
        "quantity": 2,
        "attributes": {
          "brand": "Bajaj",
          "appliance": "ac",
          "issue": "noise"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-13",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "khichdi jain nahi 4 roti 6 din ke liye breakfast me 3 sep tak": {
    "customer": null,
    "items": [
      {
        "description": "khichdi",
        "quantity": 1,
        "attributes": {
          "jain": false,
          "roti_count": 4,
          "days": 6,
          "meal": "breakfast"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-09-03",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "do rajma pura portion lunch me pichli baar jaisa nahi is baar naya": {
    "customer": null,
    "items": [
      {
        "description": "rajma",
        "quantity": 2,
        "attributes": {
          "portion": "full",
          "meal": "lunch"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "chhe ya saat exaust fan havells ke chal nahi raha aur switchboard orient ka current aa raha hai parso tak": {
    "customer": null,
    "items": [
      {
        "description": "exhaust fan",
        "quantity": 6,
        "attributes": {
          "brand": "Havells",
          "issue": "not working"
        }
      },
      {
        "description": "switch board",
        "quantity": 1,
        "attributes": {
          "brand": "Orient",
          "issue": "leaking current"
        }
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-08-24",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "deepak bhai switchboard havells ka kitchen me aur plug point do 27 sep tak": {
    "customer": "Deepak bhai",
    "items": [
      {
        "description": "switch board",
        "quantity": 1,
        "attributes": {
          "brand": "Havells",
          "room": "kitchen"
        }
      },
      {
        "description": "socket",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "needs_clarification": true,
    "due_date": "2026-09-27",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "bread do eggless aur browni chhe eggless red velvet": {
    "customer": null,
    "items": [
      {
        "description": "bread loaf",
        "quantity": 2,
        "attributes": {
          "egg_free": true
        }
      },
      {
        "description": "brownie",
        "quantity": 6,
        "attributes": {
          "egg_free": true,
          "flavour": "red velvet"
        }
      }
    ],
    "needs_clarification": false,
    "due_date": null,
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  },
  "chhe sherwani length 38 waist 28 chest 42 do blouse pink length 46 chest 36 aur paanch pant chest 46 budhvar ko nahi shukravar ko": {
    "customer": null,
    "items": [
      {
        "description": "sherwani",
        "quantity": 6,
        "attributes": {
          "length": 38,
          "waist": 28,
          "chest": 42
        }
      },
      {
        "description": "blouse",
        "quantity": 2,
        "attributes": {
          "color": "pink",
          "length": 46,
          "chest": 36
        }
      },
      {
        "description": "pant",
        "quantity": 5,
        "attributes": {
          "chest": 46
        }
      }
    ],
    "needs_clarification": false,
    "due_date": "2026-10-02",
    "amount": null,
    "references_prior_order": false,
    "confidence": 1
  }
};

export function lookupExactNormalized(raw: string): MatchedRecord | null {
  const k = (raw || "").toLowerCase().replace(/[\r\n\t]+/g, " ").replace(/[.,\/#!$%\^&\*;:{}=\-_'~()?"“”]/g, " ").replace(/\s+/g, " ").trim();
  return EXACT_TRAIN_MAP[k] || null;
}
