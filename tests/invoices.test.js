const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

//  clean out data
beforeEach(createData);

afterAll(async () => {
    await db.end()
})

describe("GET /", function () {

    test("respond with array of invoices", async function () {
        const response = await request(app).get("/invoices");
        expect(response.body).toEqual({
            "invoices": [
                { id: 1, comp_code: "apple" },
                { id: 2, comp_code: "apple" },
                { id: 3, comp_code: "ibm" },
            ]
        });
    })

});


describe("GET /1", function () {

    test("returns invoice info", async function () {
        const response = await request(app).get("/invoices/1");
        expect(response.body).toEqual(
            {
                "invoice": {
                    id: 1,
                    amt: 100,
                    add_date: '2018-01-01T08:00:00.000Z',
                    paid: false,
                    paid_date: null,
                    company: {
                        code: 'apple',
                        name: 'Apple',
                        description: 'Maker of OSX.',
                    }
                }
            }
        );
    });

    test("return 404 for no-such-invoice", async function () {
        const response = await request(app).get("/invoices/999");
        expect(response.status).toEqual(404);
    })
});