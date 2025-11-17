import './pageChanger.css'

function PageChanger({ numberPage, onPageChange }) {
  const buttons = [];

  // numberPage est un nombre
  for (let i = 1; i <= numberPage; i++) {
    buttons.push(
      <button
        key={i}
        className='buttonPageChanger'
        onClick={() => onPageChange(i)}
      >
        {i}
      </button>
    );
  }

  return <div className='containerPageChanger'>{buttons}</div>;
}

export default PageChanger;
