### Approach

- A RESTful API was implemented using Express.js with a JSON file for data persistence. The file is accessed using fs.promises.readFile, avoiding the blocking behavior of readFileSync.

- A basic in-memory cache with TTL (time-to-live) was added to reduce filesystem reads and improve performance.

- On the frontend, a React interface was developed using react-window for list virtualization, and loading skeletons for improved UX.

- Server-side pagination was integrated to reduce payload size.

- An isMounted guard was used in React effects to safely handle async state updates on unmounted components.

- Dynamic routing via useParams allows detail views for individual items.

- A simple, accessible, and responsive design was applied with minimal CSS.

### Notes

- Virtualization and skeletons enhance perceived performance.

- TTL caching reduces I/O pressure but assumes data won't change often during that window.

- Search fetches results on each keystroke; for production, debouncing should be considered.

- Validation and error boundaries can be expanded for more robustness.
