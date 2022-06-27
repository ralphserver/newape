import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Lending from "./pages/Lending";
import Earn from "./pages/Earn";
import AlertProvider from "./providers/AlertProvider";
import ConnectionProvider from "./providers/ConnectionProvider";
import theme from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <ConnectionProvider>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                {/*todo: different background in Layout*/}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                </Route>
                <Route element={<Layout />}>
                  <Route path="/borrow" element={<Lending />} />
                  <Route path="/earn" element={<Earn />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ConnectionProvider>
        </AlertProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
