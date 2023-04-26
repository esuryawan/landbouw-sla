import React from "react";
import { withRouter, WithRouterProps } from "ababil-router";
import { IValues } from "../../classes";

type AlumniListParams = {
  id: string;
};

interface AlumniListState {
  id: number;
  alumni: any;
  changes: IValues[];
  loading: boolean;
  submitSuccess: boolean;
}

class AlumniList extends React.Component<WithRouterProps<AlumniListParams>, AlumniListState> {
  override render() {
    /*
{
    "Id": 1,
    "Name": "Erick Suryawan",
    "GraduationYear": 1993,
    "Classes": "1::1, 2:A1:2, 3:A1:2",
    "Status": null,
    "UserId": 1,
    "Alias": null,
    "Title": null,
    "BirthDate": null,
    "DateOfDeath": null,
    "ExtraData": "{}"
}		 */
    return (
      <div className="container-xl">
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-6">
                  <h2>
                    Manage <b>Employees</b>
                  </h2>
                </div>
                <div className="col-sm-6">
                  <a href="#addEmployeeModal" className="btn btn-success" data-toggle="modal">
                    <i className="material-icons">&#xE147;</i> <span>Add New Employee</span>
                  </a>
                  <a href="#deleteEmployeeModal" className="btn btn-danger" data-toggle="modal">
                    <i className="material-icons">&#xE15C;</i> <span>Delete</span>
                  </a>
                </div>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    <span className="custom-checkbox">
                      <input type="checkbox" id="selectAll" />
                      <label htmlFor="selectAll"></label>
                    </span>
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="custom-checkbox">
                      <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                      <label htmlFor="checkbox1"></label>
                    </span>
                  </td>
                  <td>Thomas Hardy</td>
                  <td>thomashardy@mail.com</td>
                  <td>89 Chiaroscuro Rd, Portland, USA</td>
                  <td>(171) 555-2222</td>
                  <td>
                    <a href="#editEmployeeModal" className="edit" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Edit">
                        &#xE254;
                      </i>
                    </a>
                    <a href="#deleteEmployeeModal" className="delete" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Delete">
                        &#xE872;
                      </i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="custom-checkbox">
                      <input type="checkbox" id="checkbox2" name="options[]" value="1" />
                      <label htmlFor="checkbox2"></label>
                    </span>
                  </td>
                  <td>Dominique Perrier</td>
                  <td>dominiqueperrier@mail.com</td>
                  <td>Obere Str. 57, Berlin, Germany</td>
                  <td>(313) 555-5735</td>
                  <td>
                    <a href="#editEmployeeModal" className="edit" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Edit">
                        &#xE254;
                      </i>
                    </a>
                    <a href="#deleteEmployeeModal" className="delete" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Delete">
                        &#xE872;
                      </i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="custom-checkbox">
                      <input type="checkbox" id="checkbox3" name="options[]" value="1" />
                      <label htmlFor="checkbox3"></label>
                    </span>
                  </td>
                  <td>Maria Anders</td>
                  <td>mariaanders@mail.com</td>
                  <td>25, rue Lauriston, Paris, France</td>
                  <td>(503) 555-9931</td>
                  <td>
                    <a href="#editEmployeeModal" className="edit" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Edit">
                        &#xE254;
                      </i>
                    </a>
                    <a href="#deleteEmployeeModal" className="delete" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Delete">
                        &#xE872;
                      </i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="custom-checkbox">
                      <input type="checkbox" id="checkbox4" name="options[]" value="1" />
                      <label htmlFor="checkbox4"></label>
                    </span>
                  </td>
                  <td>Fran Wilson</td>
                  <td>franwilson@mail.com</td>
                  <td>C/ Araquil, 67, Madrid, Spain</td>
                  <td>(204) 619-5731</td>
                  <td>
                    <a href="#editEmployeeModal" className="edit" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Edit">
                        &#xE254;
                      </i>
                    </a>
                    <a href="#deleteEmployeeModal" className="delete" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Delete">
                        &#xE872;
                      </i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="custom-checkbox">
                      <input type="checkbox" id="checkbox5" name="options[]" value="1" />
                      <label htmlFor="checkbox5"></label>
                    </span>
                  </td>
                  <td>Martin Blank</td>
                  <td>martinblank@mail.com</td>
                  <td>Via Monte Bianco 34, Turin, Italy</td>
                  <td>(480) 631-2097</td>
                  <td>
                    <a href="#editEmployeeModal" className="edit" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Edit">
                        &#xE254;
                      </i>
                    </a>
                    <a href="#deleteEmployeeModal" className="delete" data-toggle="modal">
                      <i className="material-icons" data-toggle="tooltip" title="Delete">
                        &#xE872;
                      </i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="clearfix">
              <div className="hint-text">
                Showing <b>5</b> out of <b>25</b> entries
              </div>
              <ul className="pagination">
                <li className="page-item disabled">
                  <a href="#">Previous</a>
                </li>
                <li className="page-item">
                  <a href="#" className="page-link">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a href="#" className="page-link">
                    2
                  </a>
                </li>
                <li className="page-item active">
                  <a href="#" className="page-link">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a href="#" className="page-link">
                    4
                  </a>
                </li>
                <li className="page-item">
                  <a href="#" className="page-link">
                    5
                  </a>
                </li>
                <li className="page-item">
                  <a href="#" className="page-link">
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AlumniList);
