const invoices = [
  {
    "id": "34bf0548-4904-4130-919d-77be42f1d3ba",
    "ref": 1,
    "createdAt": "2021-08-18",
    "paymentDue": "2021-08-19",
    "description": "Re-branding",
    "paymentTerms": 1,
    "clientName": "Jensen Huang",
    "clientEmail": "jensenh@mail.com",
    "status": "Paid",
    "senderAddress": {
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    },
    "clientAddress": {
      "street": "106 Kendell Street",
      "city": "Sharrington",
      "postCode": "NR24 5WQ",
      "country": "United Kingdom"
    }
  },
  {
    "id": "4dcc3c6e-52ef-4c5e-a92d-e4afb49ac578",
    "ref": 2,
    "createdAt": "2021-08-21",
    "paymentDue": "2021-09-20",
    "description": "Graphic Design",
    "paymentTerms": 30,
    "clientName": "Alex Grim",
    "clientEmail": "alexgrim@mail.com",
    "status": "Pending",
    "senderAddress": {
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    },
    "clientAddress": {
      "street": "84 Church Way",
      "city": "Bradford",
      "postCode": "BD1 9PB",
      "country": "United Kingdom"
    }
  },
  {
    "id": "67d18cc4-79dd-4ce5-b0cd-c44b42900fbf",
    "ref": 3,
    "createdAt": "2021-09-24",
    "paymentDue": "2021-10-01",
    "description": "Website Redesign",
    "paymentTerms": 7,
    "clientName": "John Morrison",
    "clientEmail": "jm@myco.com",
    "status": "Paid",
    "senderAddress": {
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    },
    "clientAddress": {
      "street": "79 Dover Road",
      "city": "Westhall",
      "postCode": "IP19 3PF",
      "country": "United Kingdom"
    },
  },
  {
    "id": "7216580c-d603-4454-ab7e-2ac7b21194b7",
    "ref": 4,
    "createdAt": "2021-10-11",
    "paymentDue": "2021-10-12",
    "description": "Logo Concept",
    "paymentTerms": 1,
    "clientName": "Alysa Werner",
    "clientEmail": "alysa@email.co.uk",
    "status": "Pending",
    "senderAddress": {
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    },
    "clientAddress": {
      "street": "63 Warwick Road",
      "city": "Carlisle",
      "postCode": "CA20 2TG",
      "country": "United Kingdom"
    }
  },
  {
    "id": "92205090-99d6-442e-9173-d0eb121895ab",
    "ref": 5,
    "createdAt": "2021-10-7",
    "paymentDue": "2021-10-14",
    "description": "Re-branding",
    "paymentTerms": 7,
    "clientName": "Mellisa Clarke",
    "clientEmail": "mellisa.clarke@example.com",
    "status": "Pending",
    "senderAddress": {
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    },
    "clientAddress": {
      "street": "46 Abbey Row",
      "city": "Cambridge",
      "postCode": "CB5 6EG",
      "country": "United Kingdom"
    }
  },
  {
    "id": "98e26386-abd9-41b1-9bb1-d3ac5b99fa2e",
    "ref": 6,
    "createdAt": "2021-10-01",
    "paymentDue": "2021-10-31",
    "description": "Landing Page Design",
    "paymentTerms": 30,
    "clientName": "Thomas Wayne",
    "clientEmail": "thomas@dc.com",
    "status": "Pending",
    "senderAddress": {
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    },
    "clientAddress": {
      "street": "3964  Queens Lane",
      "city": "Gotham",
      "postCode": "60457",
      "country": "United States of America"
    }
  },
  {
    "id": "d2407e39-1cca-4547-8deb-e5935f889eb9",
    "ref": 7,
    "createdAt": "2021-11-05",
    "paymentDue": "2021-11-12",
    "description": "Logo Re-design",
    "paymentTerms": 7,
    "clientName": "Anita Wainwright",
    "clientEmail": "",
    "status": "Draft",
    "senderAddress": {
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    },
    "clientAddress": {
      "street": "",
      "city": "",
      "postCode": "",
      "country": ""
    }
  }
]

const items = [
  {
    "id": 1,
    "name": "Brand Guidelines",
    "quantity": 1,
    "price": 1800.9,
    "total": 1800.9,
    "sub_total": 1800.9

  },
  {
    "id": 2,
    "name": "Banner Design",
    "quantity": 1,
    "price": 156.0,
    "total": 156.0
  },
  {
    "id": 2,
    "name": "Email Design",
    "quantity": 2,
    "price": 200.0,
    "total": 400.0
  },
  {
    "id": 3,
    "name": "Website Redesign",
    "quantity": 1,
    "price": 14002.33,
    "total": 14002.33
  },
  {
    "id": 4,
    "name": "Logo Sketches",
    "quantity": 1,
    "price": 102.04,
    "total": 102.04
  },
  {
    "id": 5,
    "name": "New Logo",
    "quantity": 1,
    "price": 1532.33,
    "total": 1532.33
  },
  {
    "id": 5,
    "name": "Brand Guidelines",
    "quantity": 1,
    "price": 2500.0,
    "total": 2500.0
  },
  {
    "id": 6,
    "name": "Web Design",
    "quantity": 1,
    "price": 6155.91,
    "total": 6155.91
  },
  {
    "id": 7,
    "name": "Logo Re-design",
    "quantity": 1,
    "price": 3102.04,
    "total": 3102.04,
    "sub_total": 3102.04
  },
]

module.exports = {
  invoices,
  items
}
