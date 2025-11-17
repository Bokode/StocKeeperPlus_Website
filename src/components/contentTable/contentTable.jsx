import './contentTable.css'

function ContentTable({ data }) {
  if (!data || data.length === 0) {
    return <p className='waitMessage'>Rien à afficher</p>;
  }

  return (
    <table className='containerTable'>
      <tbody>
        <tr className='columnTable'>
          {Object.keys(data[0]).map((key) => (
            <th className='headerColumn' key={key}>{key}</th>
          ))}
          <th className='headerColumn'>action</th>
        </tr>

        {data.map((row, i) => (
          <tr className='columnTable' key={i}>
            {Object.keys(row).map((key) => {
              let value = row[key];
              
              if (typeof value === "boolean") {
                value = value ? "Oui" : "Non";
              } else if (key === "expirationdate") {
                value = value.slice(0, 10);
              }
            
              return (
                <td className='contentColumn' key={key}>{value}</td>
              );
            })}
            <td className='contentColumn'>A Faire</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContentTable;