# Running .http Files with VS Code REST Client

To run `.http` files using the VS Code REST Client extension, follow these steps:

1. **Install the REST Client Extension**:

    - Open VS Code.
    - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
    - Search for `REST Client`.
    - Click `Install` on the `REST Client` extension by Huachao Mao.

2. **Create a .http File**:

    - Open or create a new file with the `.http` extension.
    - Write your HTTP requests in the file. For example:
        ```http
        GET http://localhost:8081/api/book/2a7addd1-6db1-4ecb-9560-37c66dc82ddb
        ```

3. **Send the Request**:

    - Hover over the HTTP request line in your `.http` file.
    - Click on the `Send Request` button that appears above the request line.
    - The response will be displayed in a new tab within VS Code.

4. **View the Response**:
    - The response tab will show the status, headers, and body of the response.
    - You can also view the response history in the `REST Client` tab in the sidebar.

That's it! You can now run and test your HTTP requests directly from VS Code.
