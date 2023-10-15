import FirebaseContainer from "./containers/FirebaseContainer";
import { RouterProvider } from "react-router-dom";

import router from "./Routes/Routes";
function App() {
  return (
    <FirebaseContainer>
      <RouterProvider router={router} />
    </FirebaseContainer>
  );
}

export default App;
