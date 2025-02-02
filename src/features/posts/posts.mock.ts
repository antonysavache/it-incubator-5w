export const postsMock = {
    correct: {
        title: "Test Title",
        shortDescription: "Test Description",
        content: "Test Content",
        blogId: ""
    },
    incorrectTitle: {
        title: "a".repeat(31), // > 30 characters
        shortDescription: "Test Description",
        content: "Test Content",
        blogId: ""
    },
    incorrectDescription: {
        title: "Test Title",
        shortDescription: "a".repeat(101),
        content: "Test Content",
        blogId: ""
    },
    incorrectContent: {
        title: "Test Title",
        shortDescription: "Test Description",
        content: "a".repeat(1001),
        blogId: ""
    },
    allFieldsEmpty: {
        title: "",
        shortDescription: "",
        content: "",
        blogId: ""
    }
}