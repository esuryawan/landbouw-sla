import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import ScanQR from "./components/ScanQR";
import ShowQR from "./components/ShowQR";
import Absensi from "./components/Absensi";
import ChartRegistration from "./components/ChartRegistration";

import ColourCodes from "./components/ColourCodes";
import ChartPresention from "./components/ChartPresention";

import AlumniEdit from "./components/AlumniEdit";
import Roles from "./components/Roles";
import RolesAdd from "./components/RolesAdd";

import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Register />} />
			<Route path="/colors" element={<ColourCodes />} />
			<Route path="/showqr" element={<ShowQR />} />
			<Route path="/scanqr" element={<ScanQR />} />
			<Route path="/absensi" element={<Absensi />} />
			<Route path="/roles/add" element={<RolesAdd />} />
			<Route path="/roles/edit/:id/:email" element={<RolesAdd />} />
			<Route path="/roles" element={<Roles />} />
			<Route path="/alumni/:id" element={<AlumniEdit />} />
			<Route path="/chart/regs" element={<ChartRegistration />} />
			<Route path="/chart/presents" element={<ChartPresention />} />
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
