const { result } = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");
const { request } = require("../app");

// clean out data
beforeEach(createData);

afterAll(async () => {
    await db.end()
})

describe("GET /", function () {

    test("get the list of companies", async function () {
        const response = await request(app).get("/companies");
        expect(response.body).toEqual({
            "companies": [
                { code: "apple", name: "Apple" },
                { code: "ibm", name: "IBM" },
            ]
        });
    })
});

describe("GET /apple", function () {
    test("Get company info", async function () {
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple",
                    description: "Maker of OSX.",
                    invoices: [1, 2],
                }
            }
        );
    });

    test("return 404 error", async function () {
        const response = await request(app).get("/companies/blargh");
        expect(response.status).toEqual(404)
    })
});

describe("POST /", function () {
    test("add company", async function () {
        const response = await request(app)
            .post("/companies")
            .send({ name: "TacoTime", description: "Yum!" });

        expect(response.body).toEqaul(
            {
                "company": {
                    code: "tacotime",
                    name: "TacoTime",
                    description: "Yum!"
                }
            }
        );
    });

    test("return 500 for conflict", async function () {
        const response = await request(app)
            .post("/companies")
            .send({ name: "Apple", description: "Huh?" });

        expect(response.status).toEqaul(500);
    })
});