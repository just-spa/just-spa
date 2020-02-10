import { connect } from '../../libs/redux-connect/index';

const mapStateToData = (state, ownProps) => {
    return state;
}

const mapDispatchToPage = () => {
    return {};
}

Page(connect(mapStateToData, mapDispatchToPage)({
    onLoad() {
        console.log('Page ${_component} ready');
    }
}));

