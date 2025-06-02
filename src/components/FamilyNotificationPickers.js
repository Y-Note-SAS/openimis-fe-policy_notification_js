import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    historyPush, withHistory, withModulesManager, journalize,
    TextInput, formatMessage, PublishedComponent, FormattedMessage, FormPanel, LanguagePicker
} from "@openimis/fe-core";
import { fetchFamilyNotification } from "../actions";

const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
});

class FamilyNotificationPickers extends Component {
    state = {
        approvalOfNotification: false,
        languageOfNotification: null
    }

    componentDidMount() {
        const { edited, fetchingfamilyNotification, familyNotification } = this.props
        if (!!edited && edited.uuid && !familyNotification) {
            this.props.fetchFamilyNotification(this.props.modulesManager, edited.uuid)
        } else {
            if (!!familyNotification) {
                this.setState({ approvalOfNotification: familyNotification.approvalOfNotification, languageOfNotification: familyNotification.languageOfNotification })
            } else {
                this.setState(this.state)
            }
        }
    }

    onCheckedChange = () => {
        this.setState({
            approvalOfNotification: !this.state.approvalOfNotification,
            languageOfNotification: this.state.languageOfNotification
        });
    }

    onLanguageChange = (v) => {

        this.setState({
            approvalOfNotification: this.state.approvalOfNotification,
            languageOfNotification: v
        });
    }

    isChecked = () => {
        return this.state.approvalOfNotification;
    }

    getLanguageCode = () => {

        return this.state.languageOfNotification;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { updateAttribute, fetchedfamilyNotification, familyNotification } = this.props
        if (prevProps.fetchedfamilyNotification != fetchedfamilyNotification && familyNotification) {
            console.log("if family notification ", familyNotification)
            this.setState({
                approvalOfNotification: familyNotification.approvalOfNotification,
                languageOfNotification: familyNotification.languageOfNotification
            })
        }
         else {
            console.log("else family notification ", familyNotification)
            console.log('this.props ', this.props )
            console.log('this.state ', this.state )
            if (prevState.approvalOfNotification != this.state.approvalOfNotification
                || prevState.languageOfNotification != this.state.languageOfNotification) {
                const testvalue = {approvalOfNotification: false, languageOfNotification: 'en'}
                // updateAttribute('familyNotification', testvalue)
                // updateAttribute('PolicyNotification', this.state)
            }
        }
    }

    selectedLanguage = () => {
        if (!!formContribution && !!formContribution['PolicyNotification']) {
            return formContribution['PolicyNotification']['languageOfNotification'];
        } else {
            return null;
        }
    }

    render() {
        const { intl, classes, readOnly, updateAttribute, formData, edited, familyNotification } = this.props;
        console.log("quel", "bail", edited)

        return (
   
        <Grid container className={classes.item}>
            <Grid item xs={2} className={classes.item}>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={this.isChecked()}
                            disabled={readOnly}
                            onChange={e => this.onCheckedChange()}
                        />}
                    label={formatMessage(intl, "policy_notification", "notificationApproval")}
                />
            </Grid>
            <Grid item xs={2} className={classes.item}>
                <PublishedComponent
                    pubRef="core.LanguagePicker"
                    module="policy_notification"
                    value={this.getLanguageCode()}
                    readOnly={readOnly}
                    withNull={true}
                    nullLabel={"SMS Language"}
                    onChange={v => this.onLanguageChange(v)}
                    withPlaceholder={false}
                    label={formatMessage(intl, "policy_notification", "NotificationLanguage.none")}
                />
            </Grid>
        </Grid>
        );
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingfamilyNotification: state.PolicyNotification.fetchingfamilyNotification,
    fetchedfamilyNotification: state.PolicyNotification.fetchedfamilyNotification,
    familyNotification: state.PolicyNotification.familyNotification,
    errorFamily: state.PolicyNotification.errorFamily,
    mutation: state.PolicyNotification.mutation,
})

export default withModulesManager(withHistory(injectIntl(withTheme(
    connect(mapStateToProps, { fetchFamilyNotification, journalize })(
        withStyles(styles)(FamilyNotificationPickers)
    )))));