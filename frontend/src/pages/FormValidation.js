import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const FormValidation = () => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (window.$ && window.$.fn && window.$.fn.DataTable) {
      const $ = window.$;
      if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
      }
      $('#dataTable').DataTable();
    }

    return () => {
      if (window.$ && window.$.fn && window.$.fn.DataTable) {
        const $ = window.$;
        if ($.fn.DataTable.isDataTable('#dataTable')) {
          $('#dataTable').DataTable().destroy();
        }
      }
    };
  }, []);

  return (
    <Layout>
      <div className="row m-1">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4 className="main-title">Users</h4>
          <button className="btn btn-primary" type="button" onClick={() => setShowForm(!showForm)}>
            <i className="ph ph-plus"></i> Add User
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card" id="formCard" style={{ display: showForm ? 'block' : 'none' }}>
            <div className="card-body">
              <form className="row g-3 app-form" id="form-validation">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="userName">User Name</label>
                  <input className="form-control" id="userName" name="userName" placeholder="Enter user name" type="text" />
                  <div className="mt-1">
                    <span className="text-danger" id="userNameError"></span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input className="form-control" id="email" placeholder="Enter email address" type="email" />
                  <div className="mt-1">
                    <span className="text-danger" id="emailError"></span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input className="form-control" id="password" placeholder="Enter password" type="password" />
                  <div className="mt-1">
                    <span className="text-danger" id="passwordError"></span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="address">Address</label>
                  <input className="form-control" id="address" placeholder="1234 Main St" type="text" />
                  <div className="mt-1">
                    <span className="text-danger" id="addressError"></span>
                  </div>
                </div>
                
                <div className="col-12">
                  <button className="btn btn-primary" type="submit" value="Submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Users List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-striped" id="dataTable">
                  <thead className="table-light">
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>Zip</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody id="tableBody">
                    <tr>
                      <td>John Doe</td>
                      <td>john@example.com</td>
                      <td>••••••••</td>
                      <td>1234 Main St</td>
                      <td>New York</td>
                      <td>10001</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>jane@example.com</td>
                      <td>••••••••</td>
                      <td>5678 Oak Ave</td>
                      <td>Los Angeles</td>
                      <td>90001</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Michael Johnson</td>
                      <td>michael@example.com</td>
                      <td>••••••••</td>
                      <td>9012 Pine Rd</td>
                      <td>Chicago</td>
                      <td>60601</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Sarah Williams</td>
                      <td>sarah@example.com</td>
                      <td>••••••••</td>
                      <td>3456 Maple Dr</td>
                      <td>Houston</td>
                      <td>77001</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Robert Brown</td>
                      <td>robert@example.com</td>
                      <td>••••••••</td>
                      <td>7890 Elm St</td>
                      <td>Phoenix</td>
                      <td>85001</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Emily Davis</td>
                      <td>emily@example.com</td>
                      <td>••••••••</td>
                      <td>2345 Cedar Ln</td>
                      <td>Miami</td>
                      <td>33101</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>David Miller</td>
                      <td>david@example.com</td>
                      <td>••••••••</td>
                      <td>6789 Birch Rd</td>
                      <td>Seattle</td>
                      <td>98101</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Lisa Anderson</td>
                      <td>lisa@example.com</td>
                      <td>••••••••</td>
                      <td>4567 Spruce St</td>
                      <td>Denver</td>
                      <td>80201</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>James Taylor</td>
                      <td>james@example.com</td>
                      <td>••••••••</td>
                      <td>8901 Walnut Ave</td>
                      <td>Boston</td>
                      <td>02101</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Patricia Martin</td>
                      <td>patricia@example.com</td>
                      <td>••••••••</td>
                      <td>5432 Oak St</td>
                      <td>Portland</td>
                      <td>97201</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-1" type="button" aria-label="Edit">
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" type="button" aria-label="Delete">
                          <i className="ph ph-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormValidation;
