# todo-react-dotnet

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
