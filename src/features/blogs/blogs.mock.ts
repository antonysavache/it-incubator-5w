export const blogsMock = {
    correct: {
        name: "Test Blog",
        description: "Test Description",
        websiteUrl: "https://test.com"
    },
    correctCreation: {
        isMembership: false,
        name: "Test Blog",
        description: "Test Description",
        websiteUrl: "https://test.com"
    },
    incorrect: {
        name: "",
        description: "",
        websiteUrl: "invalid-url"
    },
    incorrectName: {
        name: "",
        description: "Test Description",
        websiteUrl: "https://test.com"
    },
    incorrectDescription: {
        name: "Test Blog",
        description: "",
        websiteUrl: "https://test.com"
    },
    incorrectUrl: {
        name: "Test Blog",
        description: "Test Description",
        websiteUrl: "invalid-url"
    }
}

export const basicAuthMock = {
    correct: {
        login: 'admin',
        password: 'qwerty'
    },
    incorrect: {
        login: 'wrong',
        password: 'wrong'
    }
}

export const getBasicAuthHeader = (auth = basicAuthMock.correct) => {
    return `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`
}