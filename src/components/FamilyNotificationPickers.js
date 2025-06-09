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
        languageOfNotification: null,
        isInitialized: false
    }

    componentDidMount() {
        const { edited, fetchingfamilyNotification, familyNotification } = this.props;

        if ((!!edited && edited.uuid && !familyNotification || familyNotification==null)) {
            this.props.fetchFamilyNotification(this.props.modulesManager, edited.uuid);
        } else if (!!familyNotification && !this.state.isInitialized) {
            this.setState({
                approvalOfNotification: familyNotification.approvalOfNotification,
                languageOfNotification: familyNotification.languageOfNotification,
                isInitialized: true
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.isInitialized && nextProps.familyNotification) {
            return {
                approvalOfNotification: nextProps.familyNotification.approvalOfNotification,
                languageOfNotification: nextProps.familyNotification.languageOfNotification,
                isInitialized: true
            };
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Empêche les rendus inutiles
        return (
            this.state.approvalOfNotification !== nextState.approvalOfNotification ||
            this.state.languageOfNotification !== nextState.languageOfNotification ||
            this.props.familyNotification !== nextProps.familyNotification ||
            this.props.readOnly !== nextProps.readOnly
        );
    }

    onCheckedChange = () => {
        const newApproval = !this.state.approvalOfNotification;
        this.setState({
            approvalOfNotification: newApproval
        }, () => {
            this.updateParentComponent();
        });
    }

    onLanguageChange = (v) => {
        this.setState({
            languageOfNotification: v
        }, () => {
            this.updateParentComponent();
        });
    }

    updateParentComponent = () => {
        if (!this.props.readOnly && this.state.isInitialized) {
            this.props.updateAttribute('PolicyNotification', {
                approvalOfNotification: this.state.approvalOfNotification,
                languageOfNotification: this.state.languageOfNotification
            });
        }
    }

    isChecked = () => {
        return this.state.approvalOfNotification || false;
    }

    getLanguageCode = () => {
        return this.state.languageOfNotification || 'en';
    }

    render() {
        const { intl, classes, readOnly } = this.props;
        
        return (
            <Grid container className={classes.item}>
                <Grid item xs={2} className={classes.item}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={this.isChecked()}
                                disabled={readOnly}
                                onChange={this.onCheckedChange}
                            />
                        }
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
                        onChange={this.onLanguageChange}
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
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchFamilyNotification, journalize }, dispatch);
};

export default withModulesManager(
    withHistory(
        injectIntl(
            withTheme(
                connect(
                    mapStateToProps,
                    mapDispatchToProps
                )(withStyles(styles)(FamilyNotificationPickers))
            )
        )
    )
);