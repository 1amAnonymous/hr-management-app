import Wrapper from "@/layout/wrapper/Wrapper";
import "@/styles/globals.css";
import { store } from "@/toolkit/store/store";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Toaster position="top-center" reverseOrder={false} />
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </Provider>
    </>
  );
}
