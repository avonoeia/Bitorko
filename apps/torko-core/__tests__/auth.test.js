const { userLogin } = require('../controllers/userController');
const User = require('../models/userModel');

const request = {
    body: {
        email: "", 
        password: ""
    }
}

const response = {}
response.status = jest.fn(() => response)
response.json = jest.fn()

it('Sends gargabe data for email', async () => {
    await userLogin(request, response)
    expect(response.status).toHaveBeenCalledWith(401)
})


jest.mock('../models/userModel',)

it('Sends wrong password', async () => {
    request.body.email = "sayeedur.rahman@g.bracu.ac.bd"
    request.body.password = "wrongpassword"

    User.login.mockImplementation(() => {
        throw new Error("Invalid email or password")
    })

    await userLogin(request, response)
    expect(response.status).toHaveBeenCalledWith(401)
})

it('Sends wrong email but correct password', async () => {
    request.body.email = "sayeedurrahman@g.bracu.ac.bd"
    request.body.password = "correctpassword"

    User.login.mockImplementation(() => {
        throw new Error("Invalid email or password")
    })

    await userLogin(request, response)
    expect(response.status).toHaveBeenCalledWith(401)
})

it('Correct email and password', async () => {
    request.body.email = "sayeedur.rahman@g.bracu.ac.bd"
    request.body.password = "correctpassword"

    User.login.mockImplementation(() => {
        return true
    })

    await userLogin(request, response)
    expect(response.status).toHaveBeenCalledWith(401)
})

it('UserSigup unverified', async () => {
    request.body.email = "sayeedur.rahman@g.bracu.ac.bd"
    request.body.password = "correctpassword"

    verifyBeforeSignup.mockImplementation(() => {
        return false
    })

    await userLogin(request, response)
    expect(response.status).toHaveBeenCalledWith(401)
})