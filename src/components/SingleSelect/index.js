import Select from 'react-select';

export default function SingleSelect(props) {
  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      padding: '0.4rem 1rem',
      fontSize: '1rem',
      lineHeight: '22px',
      color: '#232323'
    }),

    menu: (provided) => ({
      ...provided,
      borderRadius: 0,
      marginTop: 0,
      color: '#4e5656',
      maxHeight: '13rem'
    }),

    menuList: (provided) => ({
      ...provided,
      padding: 0,
      maxHeight: '13rem',
      overflowY: 'auto'
    }),

    control: () => ({
      display: 'flex',
      minHeight: '3.125rem',
      backgroundColor: props.backgroundColor || '',
      border: props.control || '1px solid #D9D7DD',
      borderRadius: '0.5rem'
    }),

    placeholder: (provided) => ({
      ...provided,
      color: (props.isDisabled && '#C2C2C2') || props.placeholderColor || '#232323',
      fontSize: props.placeholderFontSize || '1rem',
      fontWeight: props.placeholderFontWeight || '350',
      lineHeight: '22px'
    }),

    option: (provided, { isSelected }) => ({
      ...provided,
      paddingLeft: '1rem',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      fontSize: '1rem',
      lineHeight: '1.5rem',
      backgroundColor: isSelected ? '#3395D7' : '#fff',
      color: isSelected ? '#fff' : '#231F20',
      '&:hover': {
        backgroundColor: '#DCEDF9',
        color: isSelected ? '#fff' : '#646464',
        backgroundColor: isSelected ? '#3395D7' : '#DCEDF9'
      }
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      svg: {
        height: '1.5rem',
        width: '1.5rem',
        color: (props.isDisabled && '#C2C2C2') || props.iconColor
      }
    }),
    indicatorSeparator: () => ({ display: 'none' })
  };
  return <Select styles={customStyles} {...props} />;
}
