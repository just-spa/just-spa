import { connect } from '../../libs/redux-connect/index';

const mapStateToData = (state, ownProps) => {
    return state;
}

const mapDispatchToPage = () => {
    return {};
}

Page(connect(mapStateToData, mapDispatchToPage, true, true)({
    onLoad() {
        console.log('Page message-page ready');
    }
}));

