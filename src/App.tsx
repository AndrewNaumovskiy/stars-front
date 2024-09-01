import { SnackbarProvider } from "notistack"
import { Routes, Route, BrowserRouter } from "react-router-dom"

import LoginPage from "./pages/LoginPage"
import ClassesPage from "./pages/ClassesPage"
import StudentsPage from "./pages/StudentsPage"
import StudentInfoPage from "./pages/StudentInfoPage"

import { RequireAuth } from "./components/RequireAuth"

function App() {


	return (
		<SnackbarProvider
			maxSnack={3}
			autoHideDuration={2500}
			preventDuplicate={true}>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<LoginPage />} />

					<Route element={<RequireAuth />}>
						<Route path="/" element={<ClassesPage />} />

						<Route path="/group">
							<Route path=":id" element={<StudentsPage />} />
						</Route>

						<Route path="/student">
							<Route path=":id" element={<StudentInfoPage />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</SnackbarProvider>
	)
}

export default App
