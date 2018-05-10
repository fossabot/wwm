import React from "react"
import { connect } from "react-redux"
import { Field, FieldArray, reduxForm } from "redux-form"
import { get } from "lodash"

import { searchCodes } from "shared/modules/codes"
import Modal from "shared/containers/modal"
import Patient from "shared/containers/patient"
import { renderInput, renderTextarea, renderReactSelect } from "shared/forms/renderField"

import { ReactComponent as MedicalHistoryIcon } from "shared/icons/medical-history-active.svg"

import "react-select/dist/react-select.css"

class AddDiagnosis extends React.Component {
    constructor(props) {
        super(props)
        this.fetchCodes = this.fetchCodes.bind(this)
    }

    fetchCodes(input) {
        if (!input) {
            return Promise.resolve({ options: [] })
        }

        return this.props.searchCodes("diagnosis", input).then(results => ({ options: results.map(el => ({ value: el.id, label: el.title })) }))
    }

    render() {
        const { history } = this.props
        return (
            <Modal>
                <div className="add-diagnosis">
                    <div className="modal-header">
                        <Patient />
                        <h1>
                            <MedicalHistoryIcon />
                            Add diagnosis
                        </h1>
                    </div>

                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group col-sm-12">
                                <Field
                                    name="diagnosis"
                                    component={renderReactSelect}
                                    label="Diagnosis"
                                    // multiple={false}
                                    // backspaceRemoves={false}
                                    loadOptions={this.fetchCodes}
                                    // options={[{ id: "etset", label: "Test" }, { id: "id", label: "label" }]}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-sm-12">
                                <Field name="diagnosisDescription" component={renderTextarea} label="Description" />
                            </div>
                        </div>

                        <h2>Therapy</h2>

                        <FieldArray name="therapies" component={renderTherapies} />
                    </div>

                    <div className="modal-footer">
                        <div className="form-row">
                            <div className="col-sm-4" />
                            <div className="col-sm-4">
                                <button type="button" tabIndex="-1" className="btn btn-link btn-block" datadismiss="modal" onClick={() => history.goBack()}>
                                    Cancel
                                </button>
                            </div>

                            <div className="col-sm-4">
                                <button type="submit" className="float-right btn btn-primary btn-block">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

AddDiagnosis = reduxForm({
    form: "diagnosis"
})(AddDiagnosis)

AddDiagnosis = connect(
    state => ({
        waitlistItem: state.waitlist.item,
        // initialState: get(state, "waitlist.item.diagnosis", { diagnosis: { id: "id", label: "label" } }),
        initialValues: get(state, "waitlist.item.diagnosis", { diagnosis: { id: "id", label: "label" } }),
        searchingCodes: state.codes.searching,
        searchingResults: state.codes.searchResults
    }),
    {
        searchCodes
    }
)(AddDiagnosis)

export default AddDiagnosis

const renderTherapies = props => {
    const { fields } = props
    return (
        <React.Fragment>
            {(fields || []).map((therapy, index) => (
                <React.Fragment key={index}>
                    <div className="form-row">
                        <div className="form-group col-sm-12">
                            <Field name={`${therapy}.medicine`} component={renderInput} label="Medicine" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-sm-12">
                            <Field name={`${therapy}.intructions`} component={renderTextarea} label="Instructions" />
                        </div>
                    </div>
                </React.Fragment>
            ))}
            <div className="form-row">
                <div className="form-group">
                    <button className="btn btn-link addTherapy" onClick={() => fields.push({})}>
                        Add therapy
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}
