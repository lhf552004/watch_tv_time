import FirebaseContainer from "./containers/FirebaseContainer";
// import { RouterProvider } from "react-router-dom";
// import { ReactQueryDevtools } from "react-query/devtools";
// import { QueryClientProvider } from "react-query";
import ComputersComponent from "./components/ComputersComponent";

function App() {
  return (
    <FirebaseContainer>
      <ComputersComponent></ComputersComponent>
      {/* <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider> */}
    </FirebaseContainer>
  );
}

export default App;
