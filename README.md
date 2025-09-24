## Supported Environments

The tool has been built and tested to run locally on both Windows and Linux environments. Ensure the necessary dependencies and environment variables are properly configured for your operating system.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Structure

The repository is organized as follows:

- **public/**: Static files and frontend configuration.
- **src/**: Main React application source code.
  - **components/**: Reusable components.
  - **pages/**: Main application pages.
- **.env.local**: Local environment variables.
- **package.json**: Project dependencies and scripts.

Check each folder for more details about files and functionality.

## Environment Variables

Before running the project, create a `.env` file in the root directory with the following variables:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_GITHUB_URL=https://api.github.com/repos
```

Change the values as needed for your environment.

**The backend for the Highlight Test Code tool is available at:**  
[https://github.com/SERG-UFPI/highlight-test-backend](https://github.com/SERG-UFPI/highlight-test-backend)

**If you do not wish to install and configure the tool locally, you can access the Highlight Test Code platform directly via the web:**  
[https://highlight-test-frontend.vercel.app](https://highlight-test-frontend.vercel.app)

## Related Publication
<a id="1" href="http://dx.doi.org/10.1002/smr.70035">[1]</a> Miranda, Charles, et al. "Test Co-Evolution in Software Projects: A Large-Scale Empirical Study." Journal of Software: Evolution and Process. 37, 7 (2025), e70035.<br>
<a id="2" href="https://zenodo.org/records/16756417">[2]</a> Miranda, Charles, et al. "Highlight Test Code: Visualizing the Co-Evolution of Test and Production Code in Software Repositories." Simpósio Brasileiro de Engenharia de Software (2025).


