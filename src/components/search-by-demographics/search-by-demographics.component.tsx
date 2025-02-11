import React, { useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { DatePicker, DatePickerInput, Column, NumberInput, Switch, ContentSwitcher } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { type SearchByProps } from '../../types';
import SearchButtonSet from '../search-button-set/search-button-set';
import styles from './search-by-demographics.style.scss';
import { getDescription, getQueryDetails } from './search-by-demographics.utils';

const SearchByDemographics: React.FC<SearchByProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [livingStatus, setLivingStatus] = useState('alive');
  const [gender, setGender] = useState('all');
  const [birthDayStartDate, setBirthDayStartDate] = useState('');
  const [birthDayEndDate, setBirthDayEndDate] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const genders = [
    {
      id: 0,
      label: t('all', 'All'),
      value: 'all',
    },
    {
      id: 1,
      label: t('males', 'Male'),
      value: 'males',
    },
    {
      id: 3,
      label: t('females', 'Female'),
      value: 'females',
    },
  ];

  const livingStatuses = [
    {
      id: 0,
      label: t('alive', 'Alive'),
      value: 'alive',
    },
    {
      id: 1,
      label: t('dead', 'Dead'),
      value: 'dead',
    },
  ];

  const reset = () => {
    setMaxAge(0);
    setMinAge(0);
    setBirthDayEndDate('');
    setBirthDayStartDate('');
  };

  const submit = async () => {
    setIsLoading(true);
    const demographics = {
      gender,
      minAge,
      maxAge,
      birthDayStartDate,
      birthDayEndDate,
      livingStatus,
    };
    await onSubmit(getQueryDetails(demographics), getDescription(demographics));
    setIsLoading(false);
  };

  return (
    <>
      <Column>
        <p className={classNames(styles.text, styles.genderTitle)}>{t('gender', 'Gender')}</p>
        <div className={styles.genderContainer}>
          <div className={styles.switch}>
            <ContentSwitcher
              selectedIndex={genders[0].id}
              className={styles.contentSwitcher}
              size="lg"
              onChange={({ index }) => setGender(genders[index].value)}
            >
              {genders.map((gender) => (
                <Switch data-testid={gender.label} key={gender.id} name={gender.value} text={gender.label} />
              ))}
            </ContentSwitcher>
          </div>
          <div className={styles.switch}>
            <ContentSwitcher
              selectedIndex={livingStatuses[0].id}
              className={styles.contentSwitcher}
              size="lg"
              onChange={({ index }) => setLivingStatus(livingStatuses[index].value)}
            >
              {livingStatuses.map((livingStatus) => (
                <Switch key={livingStatus.id} name={livingStatus.value} text={livingStatus.label} />
              ))}
            </ContentSwitcher>
          </div>
        </div>
      </Column>
      <div className={styles.column}>
        <Column className={styles.age}>
          <Column>
            <NumberInput
              hideSteppers={true}
              id="minAge"
              data-testid="minAge"
              label={t('ageBetween', 'Age between')}
              invalidText={t('minAgeIsNotValid', 'The age must be greater than 0')}
              min={0}
              value={minAge}
              onChange={(event, { value }) => setMinAge(value)}
            />
          </Column>
          <Column>
            <NumberInput
              id="maxAge"
              hideSteppers={true}
              data-testid="maxAge"
              label={t('and', 'and')}
              invalidText={t('maxAgeIsNotValid', 'The age must be less than 200')}
              min={0}
              max={200}
              value={maxAge}
              onChange={(event, { value }) => setMaxAge(value)}
            />
          </Column>
        </Column>
      </div>
      <div className={styles.column}>
        <Column>
          <DatePicker
            datePickerType="single"
            allowInput={false}
            onChange={(date) => setBirthDayStartDate(dayjs(date[0]).format())}
          >
            <DatePickerInput
              id="startDate"
              labelText={t('birthDate', 'Birth date between')}
              value={birthDayStartDate && dayjs(birthDayStartDate).format('DD-MM-YYYY')}
              placeholder="DD-MM-YYYY"
              size="md"
            />
          </DatePicker>
        </Column>
        <Column>
          <DatePicker
            datePickerType="single"
            allowInput={false}
            onChange={(date) => setBirthDayEndDate(dayjs(date[0]).format())}
          >
            <DatePickerInput
              id="endDate"
              labelText={t('and', 'and')}
              value={birthDayEndDate && dayjs(birthDayEndDate).format('DD-MM-YYYY')}
              placeholder="DD-MM-YYYY"
              size="md"
            />
          </DatePicker>
        </Column>
      </div>
      <SearchButtonSet isLoading={isLoading} onHandleSubmit={submit} onHandleReset={reset} />
    </>
  );
};

export default SearchByDemographics;
