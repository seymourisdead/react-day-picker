import { expect } from 'chai';
import sinon from 'sinon';

import * as Helpers from '../src/Helpers';

describe('Helpers', () => {
  describe('cancelEvent', () => {
    it('should prevent default and stop propagation', () => {
      const e = { preventDefault: () => {}, stopPropagation: () => {} };
      const preventDefault = sinon.spy(e, 'preventDefault');
      const stopPropagation = sinon.spy(e, 'stopPropagation');
      Helpers.cancelEvent(e);
      expect(preventDefault).to.have.been.calledOnce;
      expect(stopPropagation).to.have.been.calledOnce;
    });
  });

  describe('getFirstDayOfWeekFromProps', () => {
    it('should return Sunday as default', () => {
      expect(Helpers.getFirstDayOfWeekFromProps({})).to.equal(0);
    });

    it('should return the day from localeUtils first', () => {
      const localeUtils = {
        getFirstDayOfWeek: () => 3,
      };
      expect(Helpers.getFirstDayOfWeekFromProps({ localeUtils })).to.equal(3);
    });
    it('should return the day from a number', () => {
      expect(
        Helpers.getFirstDayOfWeekFromProps({ firstDayOfWeek: 5 })
      ).to.equal(5);
    });
  });

  describe('getDaysInMonth', () => {
    it('get the correct number of days', () => {
      const date = new Date(2015, 1, 10);
      expect(Helpers.getDaysInMonth(date)).to.equal(28);
      const date1 = new Date(2016, 2, 10);
      expect(Helpers.getDaysInMonth(date1)).to.equal(31);
      const date2 = new Date(2016, 3, 10);
      expect(Helpers.getDaysInMonth(date2)).to.equal(30);
    });
    it('get the correct number of days in a leap month', () => {
      const date = new Date(2016, 1, 10);
      expect(Helpers.getDaysInMonth(date)).to.equal(29);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('get the first day of the month', () => {
      const date1 = new Date(1979, 8, 19);
      expect(Helpers.getFirstDayOfMonth(date1).getDate()).to.equal(1);
      const date2 = new Date(1979, 8, 1);
      expect(Helpers.getFirstDayOfMonth(date2).getDate()).to.equal(1);
    });
  });

  describe('getMonthsDiff', () => {
    it('returns a positive difference between two days in the same year', () => {
      const d1 = new Date(2015, 10, 6);
      const d2 = new Date(2015, 11, 6);
      expect(Helpers.getMonthsDiff(d1, d2)).to.equal(1);
    });
    it('returns a positive difference between two days in different years', () => {
      const d1 = new Date(2015, 11, 6);
      const d2 = new Date(2016, 0, 6);
      expect(Helpers.getMonthsDiff(d1, d2)).to.equal(1);
    });
    it('returns a negative difference between two days in the same year', () => {
      const d1 = new Date(2015, 3, 6);
      const d2 = new Date(2015, 2, 6);
      expect(Helpers.getMonthsDiff(d1, d2)).to.equal(-1);
    });
    it('returns a negative difference between two days in different years', () => {
      const d1 = new Date(2017, 3, 6);
      const d2 = new Date(2015, 2, 6);
      expect(Helpers.getMonthsDiff(d1, d2)).to.equal(-25);
    });
    it('returns no difference between two days in the same month', () => {
      const d1 = new Date(2015, 3, 6);
      const d2 = new Date(2015, 3, 12);
      expect(Helpers.getMonthsDiff(d1, d2)).to.equal(0);
    });
  });

  describe('getWeekArray', () => {
    it('works with a month starting on sunday (en)', () => {
      const weeks = Helpers.getWeekArray(new Date(2015, 10, 1));
      expect(weeks).to.have.length(5);
      expect(weeks[0][0].getDay()).to.equal(0);
      expect(weeks[0][0].getDate()).to.equal(1);
      expect(weeks[0][0].getMonth()).to.equal(10);
      expect(weeks[0][0].getFullYear()).to.equal(2015);
    });

    it('adds days from the previous month to the first week (en)', () => {
      const weeks = Helpers.getWeekArray(new Date(2015, 4, 10));

      expect(weeks).to.have.length(6);

      // should go back to april
      const firstDay = weeks[0][0];
      expect(firstDay.getDay()).to.equal(0);
      expect(firstDay.getDate()).to.equal(26);
      expect(firstDay.getMonth()).to.equal(3);
      expect(firstDay.getFullYear()).to.equal(2015);
    });

    it('adds days from the next month to the last week (en)', () => {
      const weeks = Helpers.getWeekArray(new Date(2015, 8, 19));

      expect(weeks).to.have.length(5);
      // go to october
      const lastDay = weeks[4][6];
      expect(lastDay.getDate()).to.equal(3);
      expect(lastDay.getMonth()).to.equal(9);
      expect(lastDay.getFullYear()).to.equal(2015);
    });

    it('adds days from the next month to the last week (it)', () => {
      const weeks = Helpers.getWeekArray(new Date(2015, 8, 19), 1);

      expect(weeks).to.have.length(5);

      const lastDay = weeks[4][6];
      expect(lastDay.getDate()).to.equal(4);
      expect(lastDay.getMonth()).to.equal(9);
      expect(lastDay.getFullYear()).to.equal(2015);
    });

    it('returns 7 days per week when starting day is sunday', () => {
      const weeks = Helpers.getWeekArray(new Date(2015, 6, 1));
      expect(weeks).to.have.length(5);
      weeks.forEach(week => {
        expect(week).to.have.length(7);
      });
    });

    it('returns 7 days per week when starting day is monday', () => {
      const weeks = Helpers.getWeekArray(new Date(2015, 6, 1), 1);
      expect(weeks).to.have.length(5);
      weeks.forEach(week => {
        expect(week).to.have.length(7);
      });
    });

    it('returns 7 days per week when starting day is saturday', () => {
      const weeks = Helpers.getWeekArray(new Date(2015, 6, 1), 6);
      weeks.forEach(week => {
        expect(week).to.have.length(7);
      });
    });
  });

  describe('isRangeOfDates', () => {
    it('should detect a properly shaped object', () => {
      expect(Helpers.isRangeOfDates({ from: new Date(), to: new Date() })).to.be
        .true;
    });
    it('should detect not properly shaped objects', () => {
      expect(Helpers.isRangeOfDates({ from: null, to: new Date() })).to.be
        .false;
      expect(Helpers.isRangeOfDates({ to: new Date() })).to.be.false;
      expect(Helpers.isRangeOfDates({ from: new Date() })).to.be.false;
    });
  });

  describe('startOfMonth', () => {
    it('should set a date as start of its month', () => {
      const date = new Date(1979, 8, 19);
      const newDate = Helpers.startOfMonth(date);

      expect(newDate.getFullYear()).to.equal(1979);
      expect(newDate.getMonth()).to.equal(8);
      expect(newDate.getDate()).to.equal(1);
      expect(newDate.getHours()).to.equal(12);
      expect(newDate.getMinutes()).to.equal(0);
      expect(newDate.getSeconds()).to.equal(0);
      expect(newDate.getMilliseconds()).to.equal(0);
    });
  });
});
