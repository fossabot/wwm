import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import _ from "lodash"

import { loadOrganization, saveOrganization } from "../../modules/organizations"
import { ADMIN_RIGHTS_RESOURCE, SELF_RIGHTS_RESOURCE, loadUserRights } from "../../modules/validations"
import { open, close } from "shared/modules/alert"
import ClinicsList from "./clinicsList"
import UsersList from "./usersList"

class OrganizationDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            organization: {},
            name: "",
            legalStatus: "",
            serviceType: "",
            representative: {},
            primaryContact: {},
            loading: true
        }
    }

    componentDidMount() {
        if (!this.props.organization && this.props.organizationID !== "new") {
            this.props.loadOrganization(this.props.organizationID)
        }
        if (this.props.canSee === undefined || this.props.canEdit === undefined) {
            this.props.loadUserRights()
        }
        if (this.props.canSee === false) {
            this.props.history.push(`/`)
        }

        this.determineState(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.organization && nextProps.organizationID !== "new" && !this.props.organizationsLoading) {
            this.props.loadOrganization(nextProps.organizationID)
        }
        if ((nextProps.canSee === undefined || nextProps.canEdit === undefined) && !nextProps.validationsLoading) {
            this.props.loadUserRights()
        }
        if (nextProps.canSee === false) {
            this.props.history.push(`/`)
        }

        this.determineState(nextProps)
    }

    determineState(props) {
        let loading = (!props.organization && props.organizationID !== "new") || props.organizationsLoading || props.canEdit === undefined || props.canSee === undefined || props.validationsLoading
        this.setState({loading: loading})

        if (props.organization) {
            let representative = _.clone(props.organization.representative)
            let primaryContact = _.clone(props.organization.primaryContact)

            this.setState({ organization: props.organization })
            this.setState({ name: props.organization.name })
            this.setState({ legalStatus: props.organization.legalStatus ? props.organization.legalStatus : "" })
            this.setState({ serviceType: props.organization.serviceType ? props.organization.serviceType : "" })
            this.setState({ representative: representative ? representative : {} })
            this.setState({ primaryContact: primaryContact ? primaryContact : {} })
        }
    }

    updateInput = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        let id
        let toAssign
        let splitID = target.id.split(".")

        if (splitID.length === 2) {
            id = splitID[0]
            toAssign = this.state[id]
            toAssign[splitID[1]] = value
        } else {
            id = target.id
            toAssign = value
        }

        this.setState({
          [id]: toAssign
        });
    }

    submit = e => {
        e.preventDefault()
        this.props.close()

        let organization = this.state.organization

        organization.name = this.state.name
        organization.legalStatus = this.state.legalStatus
        organization.serviceType = this.state.serviceType
        organization.representative = _.clone(this.state.representative)
        organization.primaryContact = _.clone(this.state.primaryContact)

        this.props.saveOrganization(organization)
            .then(response => {
                if (!organization.id && response.id) {
                    this.props.history.push(`/organizations/${response.id}`)
                }
            })
    }

    render() {
        let props = this.props
        if (this.state.loading) {
            return <div>Loading...</div>
        }
        if (!props.canSee || props.forbidden) {
            return null
        }

        return (
            <div>
                <div>
                    <h1>Organizations</h1>
                    <h2>{this.state.organization.id ? this.state.organization.name : "Add new organization"}</h2>

                    <form onSubmit={this.submit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input className="form-control" id="name" value={this.state.name} onChange={this.updateInput} disabled={!props.canEdit} placeholder="Organization name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="legalStatus">Legal status</label>
                            <input className="form-control" id="legalStatus" value={this.state.legalStatus} onChange={this.updateInput} disabled={!props.canEdit} placeholder="e.g. NGO" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Service type</label>
                            <input className="form-control" id="serviceType" value={this.state.serviceType} onChange={this.updateInput} disabled={!props.canEdit} placeholder="e.g. Basic care" />
                        </div>
                        <div className="form-group">
                            <h3>Representative</h3>
                            <div className="form-group">
                                <label htmlFor="firstName">Name</label>
                                <input className="form-control" id="representative.name" value={this.state.representative.name} onChange={this.updateInput} disabled={!props.canEdit} placeholder="Full name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className="form-control" id="representative.email" value={this.state.representative.email} onChange={this.updateInput} disabled={!props.canEdit} placeholder="user@email.com"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="specialisation">Phone number</label>
                                <input type="tel" className="form-control" id="representative.phoneNumber" value={this.state.representative.phoneNumber} onChange={this.updateInput} disabled={!props.canEdit} placeholder="+38640..." />
                            </div>
                        </div>
                        <div className="form-group">
                            <h3>Primary contact</h3>
                            <div className="form-group">
                                <label htmlFor="firstName">Name</label>
                                <input className="form-control" id="primaryContact.name" value={this.state.primaryContact.name} onChange={this.updateInput} disabled={!props.canEdit} placeholder="Full name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className="form-control" id="primaryContact.email" value={this.state.primaryContact.email} onChange={this.updateInput} disabled={!props.canEdit} placeholder="user@email.com"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="specialisation">Phone number</label>
                                <input type="tel" className="form-control" id="primaryContact.phoneNumber" value={this.state.primaryContact.phoneNumber} onChange={this.updateInput} disabled={!props.canEdit} placeholder="+38640..." />
                            </div>
                        </div>
                        <div className="form-group">
                            {props.canEdit ? (
                                <button type="submit" className="btn btn-outline-primary col">
                                    Save
                                </button>
                            ) : (null)}
                        </div>
                    </form>
                </div>
                {props.organization ? (
                    <div className="m-4">
                        <div className="m-4">
                            <ClinicsList organizationID={props.organizationID} />
                        </div>
                            <div className="m-4">
                                <UsersList organizationID={props.organizationID} />
                            </div>
                    </div>
                ) : null}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let id = ownProps.organizationID
    if (!id) {
        id = ownProps.match.params.organizationID
    }

    return {
        organizationID: id,
        organization: state.organizations.organizations ? state.organizations.organizations[id] : undefined,
        organizationsLoading: state.organizations.loading,
        canEdit: state.validations.userRights ? state.validations.userRights[ADMIN_RIGHTS_RESOURCE] : undefined,
        canSee: state.validations.userRights ? state.validations.userRights[SELF_RIGHTS_RESOURCE] : undefined,
        validationsLoading: state.validations.loading,
        forbidden: state.organizations.forbidden,
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            loadOrganization,
            saveOrganization,
            loadUserRights,
            open,
            close
        },
        dispatch
    )

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrganizationDetail))