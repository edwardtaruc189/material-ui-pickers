import * as React from 'react';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { CalendarProps } from './Calendar';
import { DatePickerView } from '../../DatePicker';
import { SlideDirection } from './SlideTransition';
import { Fade, IconButton } from '@material-ui/core';
import { useUtils } from '../../_shared/hooks/useUtils';
import { VariantContext } from '../../wrappers/Wrapper';
import { MaterialUiPickersDate } from '../../typings/date';
import { FadeTransitionGroup } from './FadeTransitionGroup';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { ArrowLeftIcon } from '../../_shared/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../../_shared/icons/ArrowRightIcon';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { ArrowDropDownIcon } from '../../_shared/icons/ArrowDropDownIcon';

export interface CalendarWithHeaderProps
  extends Pick<CalendarProps, 'minDate' | 'maxDate' | 'disablePast' | 'disableFuture'> {
  view: DatePickerView;
  month: MaterialUiPickersDate;
  /** Left arrow icon */
  leftArrowIcon?: React.ReactNode;
  /** Right arrow icon */
  rightArrowIcon?: React.ReactNode;
  /**
   * Props to pass to left arrow button
   * @type {Partial<IconButtonProps>}
   */
  leftArrowButtonProps?: Partial<IconButtonProps>;
  /**
   * Props to pass to right arrow button
   * @type {Partial<IconButtonProps>}
   */
  rightArrowButtonProps?: Partial<IconButtonProps>;
  changeView: () => void;
  onMonthChange: (date: MaterialUiPickersDate, slideDirection: SlideDirection) => void;
}

export const useStyles = makeStyles<Theme, Pick<CalendarWithHeaderProps, 'view'>>(
  theme => ({
    switchHeader: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(1.5),
      // prevent jumping in safari
      maxHeight: 30,
      minHeight: 30,
    },
    yearSelectionSwitcher: {
      marginRight: 'auto',
    },
    iconButton: {
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
    },
    previousMonthButton: {
      marginRight: theme.spacing(3),
    },
    switchViewDropdown: {
      willChange: 'transform',
      transition: theme.transitions.create('transform'),
      transform: props => (props.view === 'year' ? 'rotate(180deg)' : 'rotate(0deg)'),
    },
    monthTitleContainer: {
      flex: 1,
      display: 'flex',
      maxHeight: 30,
      overflow: 'hidden',
    },
    monthText: {
      marginRight: 4,
    },
  }),
  { name: 'MuiPickersCalendarHeader' }
);

export const CalendarHeader: React.SFC<CalendarWithHeaderProps> = ({
  view,
  month,
  leftArrowIcon,
  rightArrowIcon,
  leftArrowButtonProps,
  rightArrowButtonProps,
  changeView: switchView,
  onMonthChange,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
}) => {
  const utils = useUtils();
  const theme = useTheme();
  const classes = useStyles({ view });
  const isRtl = theme.direction === 'rtl';
  const variant = React.useContext(VariantContext);

  const selectNextMonth = () => onMonthChange(utils.getNextMonth(month), 'left');
  const selectPreviousMonth = () => onMonthChange(utils.getPreviousMonth(month), 'right');

  const isPreviousMonthDisabled = React.useMemo(() => {
    const now = utils.date();
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, utils.date(minDate)) ? now : utils.date(minDate)
    );

    return !utils.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, utils]);

  const isNextMonthDisabled = React.useMemo(() => {
    const now = utils.date();
    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, utils.date(maxDate)) ? now : utils.date(maxDate)
    );

    return !utils.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, utils]);

  return (
    <>
      <div className={classes.switchHeader}>
        <div
          className={classes.monthTitleContainer}
          onClick={() => variant !== 'inline' && switchView()}
        >
          <FadeTransitionGroup transKey={utils.getMonthText(month)}>
            <Typography
              align="center"
              variant="subtitle1"
              className={classes.monthText}
              children={utils.getMonthText(month)}
            />
          </FadeTransitionGroup>
          <FadeTransitionGroup transKey={utils.getYearText(month)}>
            <Typography align="center" variant="subtitle1" children={utils.getYearText(month)} />
          </FadeTransitionGroup>

          <IconButton onClick={switchView} size="small" className={classes.yearSelectionSwitcher}>
            <ArrowDropDownIcon className={classes.switchViewDropdown} />
          </IconButton>
        </div>

        <Fade in={view === 'date'}>
          <div>
            <IconButton
              size="small"
              {...leftArrowButtonProps}
              disabled={isPreviousMonthDisabled}
              onClick={selectPreviousMonth}
              className={clsx(
                classes.iconButton,
                classes.previousMonthButton,
                leftArrowButtonProps?.className
              )}
            >
              {isRtl ? rightArrowIcon : leftArrowIcon}
            </IconButton>

            <IconButton
              size="small"
              {...rightArrowButtonProps}
              disabled={isNextMonthDisabled}
              onClick={selectNextMonth}
              className={clsx(classes.iconButton, rightArrowButtonProps?.className)}
            >
              {isRtl ? leftArrowIcon : rightArrowIcon}
            </IconButton>
          </div>
        </Fade>
      </div>
    </>
  );
};

CalendarHeader.displayName = 'CalendarHeader';

CalendarHeader.propTypes = {
  leftArrowIcon: PropTypes.node,
  rightArrowIcon: PropTypes.node,
};

CalendarHeader.defaultProps = {
  leftArrowIcon: <ArrowLeftIcon />,
  rightArrowIcon: <ArrowRightIcon />,
};

export default CalendarHeader;
