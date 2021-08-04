export const SET_VC = "SET_VC"
export const SET_JWT = "SET_JWT"

export const MOCK_DATA = {
  vc: {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    credentialSubject: {
      administeringCentre: "สถาบันบำราศนราดูร",
      atcCode: "81901420017654742548",
      batchNumber: "A2021010041",
      birthDate: "2001-01-01",
      certificateIssuer: "กระทรวงสาธารณสุข",
      certificateNumber: "63926444725",
      certificateValidFrom: "2021-02-14",
      certificateValidTo: "2022-02-14",
      cityOfVaccination: "นนทบุรี",
      countryOfVaccination: "TH",
      cvxCode: "208",
      cycleNumber: "1/2",
      dateOfVaccination: "2021-03-09",
      disease: "ICD-10",
      familyName: "สนามใจ",
      formVersion: "1.0.mock",
      gender: "1",
      givenName: "นาย ธนกร",
      healthProfessional: "นางซีโน เวค",
      linkedVaccineEvent: "4d76deb2-8f1c-4a5f-ba9f-a9fbe50d340c",
      marketingAuthorizationHolder: "80777-273-10",
      medicinalProductName: "80777-273-10",
      middleName: "อำโพ",
      nextVaccinationDate: "2001-01-01",
      recipient: "1234567890123",
      stateOfVaccination: "พญาไท",
      vaccineDescription: "1119305005|1119349007|1142178009",
      vaccineEvent: "1",
    },
  },
  version: 0.1,
  iss: "finema_team",
  nbf: 1619168642,
}

export const MOCK_JWT =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImFkbWluaXN0ZXJpbmdDZW50cmUiOiLguKrguJbguLLguJrguLHguJnguJrguLPguKPguLLguKjguJnguKPguLLguJTguLnguKMiLCJhdGNDb2RlIjoiODE5MDE0MjAwMTc2NTQ3NDI1NDgiLCJiYXRjaE51bWJlciI6IkEyMDIxMDEwMDQxIiwiYmlydGhEYXRlIjoiMjAwMS0wMS0wMSIsImNlcnRpZmljYXRlSXNzdWVyIjoi4LiB4Lij4Liw4LiX4Lij4Lin4LiH4Liq4Liy4LiY4Liy4Lij4LiT4Liq4Li44LiCIiwiY2VydGlmaWNhdGVOdW1iZXIiOiI2MzkyNjQ0NDcyNSIsImNlcnRpZmljYXRlVmFsaWRGcm9tIjoiMjAyMS0wMi0xNCIsImNlcnRpZmljYXRlVmFsaWRUbyI6IjIwMjItMDItMTQiLCJjaXR5T2ZWYWNjaW5hdGlvbiI6IuC4meC4meC4l-C4muC4uOC4o-C4tSIsImNvdW50cnlPZlZhY2NpbmF0aW9uIjoiVEgiLCJjdnhDb2RlIjoiMjA4IiwiY3ljbGVOdW1iZXIiOiIxLzIiLCJkYXRlT2ZWYWNjaW5hdGlvbiI6IjIwMjEtMDMtMDkiLCJkaXNlYXNlIjoiSUNELTEwIiwiZmFtaWx5TmFtZSI6IuC4quC4meC4suC4oeC5g-C4iCIsImZvcm1WZXJzaW9uIjoiMS4wLm1vY2siLCJnZW5kZXIiOiIxIiwiZ2l2ZW5OYW1lIjoi4LiZ4Liy4LiiIOC4mOC4meC4geC4oyIsImhlYWx0aFByb2Zlc3Npb25hbCI6IuC4meC4suC4h-C4i-C4teC5guC4mSDguYDguKfguIQiLCJsaW5rZWRWYWNjaW5lRXZlbnQiOiI0ZDc2ZGViMi04ZjFjLTRhNWYtYmE5Zi1hOWZiZTUwZDM0MGMiLCJtYXJrZXRpbmdBdXRob3JpemF0aW9uSG9sZGVyIjoiODA3NzctMjczLTEwIiwibWVkaWNpbmFsUHJvZHVjdE5hbWUiOiI4MDc3Ny0yNzMtMTAiLCJtaWRkbGVOYW1lIjoi4Lit4Liz4LmC4LieIiwibmV4dFZhY2NpbmF0aW9uRGF0ZSI6IjIwMDEtMDEtMDEiLCJyZWNpcGllbnQiOiIxMjM0NTY3ODkwMTIzIiwic3RhdGVPZlZhY2NpbmF0aW9uIjoi4Lie4LiN4Liy4LmE4LiXIiwidmFjY2luZURlc2NyaXB0aW9uIjoiMTExOTMwNTAwNXwxMTE5MzQ5MDA3fDExNDIxNzgwMDkiLCJ2YWNjaW5lRXZlbnQiOiIxIn19LCJ2ZXJzaW9uIjowLjEsImlzcyI6ImZpbmVtYV90ZWFtIiwibmJmIjoxNjE5MTY4NjQyfQ.zXzmRh3yXaa5QPhtORN8tgsF3-qYrjW4AI-GU5IVho4--AX99PB6M1xTD0t6-xPiiPX5a8qwwdmqJ9PC5OBWzQ"
