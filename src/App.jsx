import React, { Component } from "react";
import axios from "axios";

// Style
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const url = "http://localhost:5000/Persons/";

class App extends Component {
	state = {
		data: [],
		modalInsert: false,
		modalDelete: false,
		form: {
			id: "",
			name: "",
			lastname: "",
			documenttype: "",
			document: "",
			email: "",
			phone: "",
			birthdate: "",
			file: "",
			ModalType: "",
		},
	};

	petitionGet = () => {
		axios
			.get(url)
			.then((response) => {
				this.setState({ data: response.data });
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	petitionPost = async () => {
		delete this.state.form.id;
		await axios
			.post(url, this.state.form)
			.then((response) => {
				this.modalInsert();
				this.petitionGet();
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	petitionPut = () => {
		axios
			.put(url + this.state.form.id, this.state.form)
			.then((response) => {
				this.modalInsert();
				this.petitionGet();
			});
	};

	petitionDelete = () => {
		axios.delete(url + "/" + this.state.form.id).then((response) => {
			this.setState({ modalDelete: false });
			this.petitionGet();
		});
	};

	modalInsert = () => {
		this.setState({ modalInsert: !this.state.modalInsert });
	};

	selectPerson = (person) => {
		this.setState({
			ModalType: "update",
			form: {
				id: person.id,
				name: person.name,
				lastname: person.lastname,
				documenttype: person.documenttype,
				document: person.document,
				email: person.email,
				phone: person.phone,
				birthdate: person.birthdate,
				file: person.file,
			},
		});
	};

	handleChange = async (e) => {
		e.persist();
		await this.setState({
			form: {
				...this.state.form,
				[e.target.name]: e.target.value,
			},
		});
		console.log(this.state.form);
	};

	validateFile = (e) => {
		const file = e.target.files[0];
		if (file.size > 5000000) {
			alert("The file is very large.");
			e.target.value = "";
		}
		if (file.type !== "image/jpeg" && file.type !== "application/pdf") {
			alert("Valid file formats are JPG and PDF.");
			e.target.value = "";
		}
	};

	componentDidMount() {
		this.petitionGet();
	}

	render() {
		const { form } = this.state;
		return (
			<div className="App">
				<div className="container">
					<button
						className="btn btn-success mt-3"
						onClick={() => {
							this.setState({ form: null, ModalType: "insert" });
							this.modalInsert();
						}}
					>
						Add Person
					</button>

					<table className="table table-striped table-hover table-sm mt-3 caption-top table-responsive">
						<caption>List of persons</caption>
						<thead className="table-dark bg-primary">
							<tr>
								<th>ID</th>
								<th>Type Document</th>
								<th>Document</th>
								<th>Name</th>
								<th>Last-Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Birthdate</th>
								<th colSpan={2}>File</th>
							</tr>
						</thead>
						<tbody>
							{this.state.data.map((person) => {
								return (
									<tr>
										<td>{person.id}</td>
										<td>{person.documenttype}</td>
										<td>{person.document}</td>
										<td>{person.name}</td>
										<td>{person.lastname}</td>
										<td>{person.email}</td>
										<td>{person.phone}</td>
										<td>{person.birthdate}</td>
										<td>{person.file}</td>
										<td>
											<button
												className="btn btn-primary"
												onClick={() => {
													this.selectPerson(person);
													this.modalInsert();
												}}
											>
												<FontAwesomeIcon
													icon={faEdit}
												/>
											</button>
											<button
												className="btn btn-danger"
												onClick={() => {
													this.selectPerson(person);
													this.setState({
														modalDelete: true,
													});
												}}
											>
												<FontAwesomeIcon
													icon={faTrashAlt}
												/>
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<Modal
					isOpen={this.state.modalInsert}
					fullscreen="xl"
					size="lg"
					scrollable
				>
					<ModalHeader style={{ display: "block" }}>
						<span
							style={{ float: "right" }}
							onClick={() => this.modalInsert()}
						>
							x
						</span>
						Person
					</ModalHeader>

					<ModalBody>
						<div className="form-group">
							<label htmlFor="documenttype">Document Type</label>
							<select
								className="form-control"
								name="documenttype"
								id="documenttype"
								onChange={this.handleChange}
								value={form ? form.documenttype : ""}
							>
								<option value="">Select</option>
								<option value="CC">CC</option>
								<option value="CE">CE</option>
							</select>

							<label htmlFor="document">Document</label>
							<input
								className="form-control"
								type="text"
								name="document"
								id="document"
								onChange={this.handleChange}
								value={form ? form.document : ""}
								placeholder="Enter your document number."
							/>

							<label htmlFor="name">Name</label>
							<input
								className="form-control"
								type="text"
								name="name"
								id="name"
								onChange={this.handleChange}
								value={form ? form.name : ""}
								placeholder="Enter your name."
							/>

							<label htmlFor="lastname">Last Name</label>
							<input
								className="form-control"
								type="text"
								name="lastname"
								id="lastname"
								onChange={this.handleChange}
								value={form ? form.lastname : ""}
								placeholder="Enter your last name."
							/>

							<label htmlFor="email">Email</label>
							<input
								className="form-control"
								type="email"
								name="email"
								id="email"
								onChange={this.handleChange}
								value={form ? form.email : ""}
								placeholder="Enter your email."
							/>

							<label htmlFor="phone">Phone</label>
							<input
								className="form-control"
								type="text"
								name="phone"
								id="phone"
								onChange={this.handleChange}
								value={form ? form.phone : ""}
								placeholder="Enter your phone number."
							/>

							<label htmlFor="birthdate">Birth Date</label>
							<input
								className="form-control"
								type="date"
								name="birthdate"
								id="birthdate"
								onChange={this.handleChange}
								value={form ? form.birthdate : ""}
							/>

							<label htmlFor="file">File </label>
							<input
								className="form-control"
								type="file"
								name="file"
								id="file"
								onChange={this.handleChange}
								onFocus={this.validateFile}
								accept=".jpeg, .jpg, .pdf"
								data-max-size="5000000"
							/>
						</div>
					</ModalBody>

					<ModalFooter>
						{this.state.ModalType == "insert" ? (
							<button
								className="btn btn-success"
								onClick={() => this.petitionPost()}
							>
								Insert
							</button>
						) : (
							<button
								className="btn btn-primary"
								onClick={() => this.petitionPut()}
							>
								Update
							</button>
						)}
						<button
							className="btn btn-danger"
							onClick={() => this.modalInsert()}
						>
							Cancel
						</button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={this.state.modalDelete}>
					<ModalBody>
						Are you sure you want to eliminate the Person with the
						name of: {form && form.name} {form && form.lastname}?
					</ModalBody>
					<ModalFooter>
						<button
							className="btn btn-danger"
							onClick={() => this.petitionDelete()}
						>
							Yes
						</button>
						<button
							className="btn btn-secundary"
							onClick={() =>
								this.setState({ modalDelete: false })
							}
						>
							No
						</button>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}
export default App;
