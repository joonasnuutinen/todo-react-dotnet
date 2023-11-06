# Frontend Technical Assignment

This package contains source code of a web application. We ask you to review the code and refine and enhance this application. The application serves only as an exercise and has no relation to actual systems developed by Sievo.
 
The purpose of this exercise is to help us see your approach to working with code, and to see what kind of suggestions you would make to improve the application.

# The Application

The application is a service that lets users create to-do lists. Each todo list has a unique URL path, where its respective items are displayed. Within the app, users can edit the todo list name and as well view, add, and delete todo items, and these changes will be saved to the database. When you open the service for the first time, it will take you to a new empty to-do list which you can fill out. The to-do list is identified by a GUID, which is included in the page URL. You can store the URL as a bookmark to be able to access the same to-do list again later.

The service itself consists of two parts:

- Backend web API implemented in ASP.NET Core
- Frontend single-page application implemented in React

The backend persists data in a LocalDB SQL database. LocalDB is automatically installed alog with Visual Studio. A production version of the database has been omitted for the sake of simplicity. 

You can view data in the LocalDB database with SQL Server Management Studio by connecting to `(localdb)\mssqllocaldb` and checking the `TodoAppDb` database.

## The Assignment
The application has several areas that need enhancement. Some of them we expect you to do; others are optional and you may skip them for your own reasons. We expect the required parts of the assignment to take about 4 hours of your time.

- Code Quality: Currently, the code is intentionally unrefined and lacks polish. Please improve the code quality and ensure it's readable and easily maintainable.
- UX: Please enhance the overall user experience regarding look and feel of the app and its usability.
- Features: The app is lacking a table to display todo lists.
- Testing: Test coverage is not comprehensive.

You don't have to keep any of the existing code if you feel so. 

### 1. Code Refactoring

Please improve the code's readability and maintainability. Technology switches, such as using `@tanstack/query` for data fetching are welcome.

### 2. Improve UX

The UX is not good enough. Please improve the UX as you see fit.

### 3. Optional: Introduce new feature - Todo lists table

This is a optional part of the assignment. If you skip it, please prepare to discuss how you would approach this task.

Add a table to home route `/` display todo lists with the following columns:
- Button to access todo items (Open)
- Title

- On clicking the _Open_ button, reveal the corresponding todo list items in a new route `/:id` or `/todo-lists/:id` 
where `:id` is the todo list id
- On adding a new item the table should be updated automatically
- It's suggested to use `@tanstack/react-table` for the table lib. However, you can opt for any other library or create 
your custom table component
- It's suggested to use `react-router-dom` for routing. However, you can opt for any other library or create your custom
routing solution

#### Wireframes
A basic wireframes can be found at

- home: _/frontend/docs/wireframe-list.drawio_
- details: _/frontend/docs/wireframe-details.drawio_

These are not a design templates but they serve as a reference. Feel free to implement the app UX as you see fit.

### 4. Optional: Introduce new feature - Save success and fail alert
This is a optional part of the assignment. If you skip it, please prepare to discuss how you would approach this task.

  On adding a new todo item, show a success alert if the operation was successful, otherwise show a fail alert.

### 5. Optional - Missing things
This is a optional part of the assignment. If you skip it, please prepare to discuss how you would approach this task.

  Think what else would be missing from the code or features and, possibly, add them.

## Development instructions

Migrate the database (in the initial only)
```
dotnet tool install --global dotnet-ef
dotnet ef database update
```
You can view data in the LocalDB database with SQL Server Management Studio by connecting to `(localdb)\mssqllocaldb` and checking the `TodoAppDb` database.

Run backend
```
dotnet run --project .\backend.csproj
```

Run frontend
```
yarn start
```
or
```
npm start
```

### Accessing the App

The app is served at `https://localhost:7063`
API Endpoints: `https://localhost:7063/swagger`

## Known issues

### Code refactoring

- Some functions lack explicit return types. Adding them could decrease the likelihood of bugs.
- Should we use Redux instead of `useContext` to have a more structured state management? We could then also abstract away the request handling logic to `createAsyncThunk`.
- Should we use a more opinionated way to manage styling? E.g. Tailwind or BEM.

### UX

- Implement drag and drop for the cards (e.g. [dnd-kit](https://dndkit.com/))
- Styling could be more modern. Maybe involve a graphic designer?

### Todo lists table

This hasn't been implemented.

### Save success and fail alert

This hasn't been implemented.

### Testing

The tests haven't been updated to reflect the recent changes.
