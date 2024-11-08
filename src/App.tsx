import { SnackbarProvider } from "notistack"
import { Routes, Route, BrowserRouter } from "react-router-dom"

import StudentsPage from "./pages/StudentsPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import ReschedulePage from "./pages/ReschedulePage"
import StudentInfoPage from "./pages/StudentInfoPage"
import ClassesPage from "./pages/ClassesPage/ClassesPage"

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

						<Route path="/schedule" element={<ReschedulePage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</SnackbarProvider>
	)
}

export default App
