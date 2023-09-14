import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Register from "./components/Register";
import ScanQR from "./components/ScanQR";
import ShowQR from "./components/ShowQR";
import Absensi from "./components/Absensi";
import ChartRegistration from "./components/ChartRegistration";
import ChartPresention from "./components/ChartPresention";
import ChartConfirmation from "./components/ChartConfirmation";
import AlumniEdit from "./components/AlumniEdit";
import Roles from "./components/Roles";
import RolesAdd from "./components/RolesAdd";
import SLA2023 from "./components/SLA2023";
import ChartConfirmNames from "./components/ChartConfirmNames";
import ChartPresentNames from "./components/ChartPresentNames";
import ChartPresentionLive from "./components/ChartPresentionLive";


const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Register />} />
			<Route path="/sla2023" element={<SLA2023 />} />
			<Route path="/showqr" element={<ShowQR />} />
			<Route path="/scanqr" element={<ScanQR />} />
			<Route path="/absensi" element={<Absensi />} />
			<Route path="/roles/add" element={<RolesAdd />} />
			<Route path="/roles/edit/:id/:email" element={<RolesAdd />} />
			<Route path="/roles" element={<Roles />} />
			<Route path="/alumni/:id" element={<AlumniEdit />} />
			<Route path="/chart/regs" element={<ChartRegistration />} />
			<Route path="/chart/presents" element={<ChartPresention />} />
			<Route path="/chart/presentLive" element={<ChartPresentionLive />} />
			<Route path="/chart/present/:year" element={<ChartPresentNames />} />
			<Route path="/chart/confirmation" element={<ChartConfirmation />} />
			<Route path="/chart/confirm/:year" element={<ChartConfirmNames />} />
			
			<Route
				path="*"
				element={
					<main>
						<p>There&apos;s nothing here!</p>
					</main>
				}
			/>
		</Routes>
	</BrowserRouter>
);
