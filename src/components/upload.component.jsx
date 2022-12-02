import React from 'react'

export default function UploadForm({ handleFileUpload, handleSubmitFileUpload, fileData, toggle }) {
    console.log("toggle: ", toggle)
    return (
        <form className="my-5" onSubmit={handleSubmitFileUpload} onChange={handleFileUpload}
        // onSubmit={addJob}>
        >{
                <label htmlFor="company_logo" className="form-label border rounded position-relative" id="company-logo-label">
                    <div id='upload-content' className="position-absolute logo-label">
                        <center>
                            {!fileData ? (<i className="bi bi-plus-lg"></i>) : (<i id="file-logo" class="bi bi-file-earmark-arrow-down-fill"></i>)}
                            {!fileData ? (<p>Upload JSON File.</p>) : (<p>{fileData.get("file").name}</p>)}
                        </center>
                    </div>
                    <input type="file" required onChange={handleFileUpload} className="form-control company_logo" name="company_logo" id="company_logo" />
                </label>
            }
            <center>
                <div class="d-grid gap-2">
                    <button className="btn btn-lg btn-primary">
                        {toggle.toggleData ? (
                            <><div class="spinner-border text-light" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                                &nbsp;&nbsp;
                            </>) : ("")}
                        Submit File
                    </button>
                </div>
            </center>
        </form>
    )
}
