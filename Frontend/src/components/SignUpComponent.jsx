import React, {useState} from 'react';
import UserPool from '../utils/UserPool';
import toast from 'react-hot-toast';
import OTPComponent from './OTPComponent';
import VerifyEmailComponent from './VerifyEmailComponent';

const SignUpComponent = () => {
    const [formData, setFormData] = useState({
      name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });
    const [otp, setOtp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
          
          UserPool.signUp(formData.email, formData.password, [] , [], (err, data) => {
            if (err) {
              console.error(err);
            } else {
             toast.success("User created successfully");
             setOtp(true);
            }
          });
      };
  return (
    <div>
    {!otp ? <>

      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={handleSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>
              <div className="form-group">
                <label htmlFor="email">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <input
                  type="confirmpassword"
                  className="form-control"
                  value={formData.confirmpassword}
                    onChange={e => setFormData({ ...formData, confirmpassword: e.target.value })}
                  name="confirmpassword"
                  placeholder="Confirm Password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>  
        </div>
    </>
        : <div>
            <OTPComponent email={formData.email} password={formData.password} name={formData.name}/>
        
        </div>}
    </div>
  );
}

export default SignUpComponent;
