import React from 'react'

export default function AddForm({ handleFormChange, addFormJob, jobForm }) {
    return (
        <form className="my-5" onChange={handleFormChange} onSubmit={addFormJob}>
            <div className="company_logo">
                <div>
                    <label htmlFor="company_logo"><h4>Company Logo</h4></label>
                </div>
                {
                    jobForm.company_logo ? <img src={jobForm.company_logo} className="company_logo" alt="company_logo" /> : (
                        <label htmlFor="company_logo" className="form-label border rounded position-relative" id="company-logo-label">
                            <div className="position-absolute logo-label">
                                <center>
                                    <i className="bi bi-plus-lg"></i>
                                    <p>Upload Company Logo</p>
                                </center>
                            </div>
                            <input type="file" required className="form-control company_logo" name="company_logo" id="company_logo" />
                        </label>
                    )
                }
            </div>
            <div className="company_name">
                <label htmlFor="company_name" className="form-label"><h4>Name of the company</h4></label>
                <input autoComplete='off' type="text" required className="form-control company_name" name="company_name" id="company_name" placeholder="Eg: Google, Microsoft, etc" />
            </div>
            <div className="type">
                <label htmlFor="type" className="form-label"><h4>Type</h4></label>
                <input autoComplete='off' type="text" required className="form-control type" name="type" id="type" placeholder="Eg: Tech or Non-Tech" />
            </div>
            <div className="email_id">
                <label htmlFor="company_name" className="form-label"><h4>Email</h4></label>
                <input autoComplete='off' type="email" required className="form-control email_id" name="email" id="email_id" placeholder="Eg: jhon@microsoft.com" />
            </div>
            <div className="tags">
                <label htmlFor="tags" className="form-label"><h4>Hastags</h4></label>
                <input autoComplete='off' type="text" className="form-control tags" name="tags" id="tags" placeholder="Eg: sde, google, tech job" />
            </div>
            <div className="submit-btn">
                <button type="submit" className='btn btn-primary'>Add &nbsp; &nbsp;<i className="bi bi-plus-lg"></i></button>
            </div>
        </form>
    )
}
