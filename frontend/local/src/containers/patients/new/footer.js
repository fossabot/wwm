import React from "react"
import { withRouter } from "react-router-dom"

const Footer = ({ history, reset, previousPage, creating }) => (
    <div className="modal-footer">
        <div className="form-row">
            <div className="col-sm-4">
                <button
                    type="button"
                    tabIndex="-1"
                    className="btn btn-link btn-block"
                    data-dismiss="has-modal"
                    onClick={() => {
                        reset()
                        history.push("/")
                    }}
                >
                    Cancel
                </button>
            </div>
            <div className="col-sm-4">
                {previousPage && (
                    <button type="button" className="float-right btn btn-secondary btn-block" onClick={previousPage}>
                        Back
                    </button>
                )}
            </div>
            <div className="col-sm-4">
                <button type="submit" data-dismiss="has-modal" className="float-right btn btn-primary btn-block" disabled={creating}>
                    {creating ? "Saving..." : "Next"}
                </button>
            </div>
        </div>
    </div>
)

export default withRouter(Footer)
