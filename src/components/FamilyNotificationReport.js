import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PreviewIcon from "@material-ui/icons/ListAlt";
import { formatMessage, FormattedMessage, PublishedComponent, withModulesManager, journalize } from "@openimis/fe-core";
import { preview, generateFamilyNotificationReport } from "../actions"
import { RIGHT_FAMILY_POLICY_NOTIFICATION_REPORT } from "../../constants";
import { Grid, IconButton, CircularProgress, Button, MenuItem, Tooltip, Modal, Paper } from "@material-ui/core"

const styles = theme => ({
    item: {
        padding: theme.spacing(1)
    },
    generating: {
        margin: theme.spacing(1)
    },
    paperDiv: {
        position: 'absolute',
        align: 'center',
        width: '30%',
        backgroundColor: theme.palette.background.paper,
        border: '0px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 2, 2),
        textAlign: 'center'
      },
    paper: theme.paper.body,
    paperHeader: theme.paper.header,
    paperHeaderTitle: theme.paper.title,
    paperHeaderAction: theme.paper.action,
    paperDivider: theme.paper.divider,
})


class FamilyNotificationReport extends Component {
    state = {
        hidden: false,
        toolTipOpen: false,
        modalOpen: false,
        claim_ai: null,
        modalTop: '50%',
        modalLeft: '50%',
        menuItemRef: null
    }

    menuItemRef = null

    _filterValue = k => {
        const { filters } = this.props;
        return !!filters[k] ? filters[k].value : null
    }

    filtersToQueryParams = (filters) => {
        let prms = Object.keys(filters)
            .filter(family => !!state.filters[family]['filter'])
            .map(family => state.filters[family]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { filters, selection } = this.props;

        if (!prevProps.generating && !!this.props.generating) {
            let reportFilters = Object.values(filters).filter(f => !!f && !!f['filter']).map(f => f['filter'])
            this.props.generateFamilyNotificationReport({ ...reportFilters })
        } 
    }

    handleTooltipClose = () => {
        this.setState({toolTipOpen : false })
    }

    handleTooltipOpen = () => {
        const { filters } = this.props
        if (!!filters && !('parentLocation' in filters)) {
            this.setState({toolTipOpen : true })
        }
    }

    handleCloseModal = () => {
        this.setState({modalOpen : false })
    }

    setMenuItemRef = element => {    
        this.setState({menuItemRef: element}); 
    };

    onMenuItemClick = (e) => {
        const { filters } = this.props
        if ( !!filters && !!('parentLocation_2' in filters)) {
            this.setState({modalOpen: true})
        }
        this.props.preview();
    }

    render() {
        const { intl, filters, rights, classes, generating } = this.props;
        let valid_rights = !!rights.filter(r => r == RIGHT_FAMILY_POLICY_NOTIFICATION_REPORT).length
        if (valid_rights) {
            return (
                <div>
                <div ref={this.setMenuItemRef}>
                {!generating &&
                    <Tooltip 
                    title={formatMessage(intl, "policy_notification", "disabledReportNoRegion")}
                    open={this.state.toolTipOpen}>
                        <div
                        onMouseLeave={this.handleTooltipClose}
                        onMouseEnter={this.handleTooltipOpen}>
                            
                        <MenuItem 
                        key={`selectionsMenu-claim_ai-${classes.item}`} 
                        disabled={!!filters && !('parentLocation' in filters)}
                        onClick={e => this.onMenuItemClick(e)}
                        >
                            {formatMessage(intl, "policy_notification", "ReportModal")}
                        </MenuItem>
                        </div>
                    </Tooltip>
                }
                {!!generating && <CircularProgress className={classes.generating} size={24} />}
                </div>
                </div>
            )
        }
        else {
            return null
        }
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    generating: state.PolicyNotification.generatingFamilyNotificationReport,
    claimsPageInfo: state.claim.claimsPageInfo,
    filters: state.core.filtersCache.insureeFamiliesPageFiltersCache
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { preview, generateFamilyNotificationReport, journalize },
        dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FamilyNotificationReport))));
