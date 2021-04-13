import GoalProgress from '../ui/GoalProgress'
import { connect } from 'react-redux'
import { setGoal } from "../../actions";

const mapStateToProps = state => ({
    current: state.allSkiDays.length,
    goal: state.goal
})

const mapDispatchToProps = dispatch => ({
    onNewGoal(goal) {
        dispatch(setGoal(goal))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(GoalProgress)


/*
export default () =>
    <GoalProgress current={10}
                  goal={20}
                  onNewGoal={goal => console.log('todo: change goal', goal)} />
 */