import { connect } from 'react-redux'
import BusinessCategories from './BusinessCategories'
import { Dispatch } from 'redux'
import { getBusinessCategoriesRequest } from 'features/business-categories/ducks/actions'

const mapStateToProps = (state: any) => ({
  businessCategories: state.entities.businessCategories,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getBusinessCategories: () => dispatch(getBusinessCategoriesRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(BusinessCategories)
