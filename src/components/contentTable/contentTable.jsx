import './contentTable.css'

function ContentTable() {
  return (
    <table className='containerTable'>
      <tbody>
        <tr className='columnTable'>
            <th className='headerColumn'>Company</th>
            <th className='headerColumn'>Contact</th>
            <th className='headerColumn'>Action</th>
        </tr>
        <tr className='columnTable'>
            <td className='contentColumn'>Alfreds Futterkiste</td>
            <td className='contentColumn'>Maria Anders</td>
            <td className='contentColumn'>A faire</td>
        </tr>
        <tr className='columnTable'>
            <td className='contentColumn'>Centro comercial Moctezuma</td>
            <td className='contentColumn'>Francisco Chang</td>
            <td className='contentColumn'>A faire</td>
        </tr>
      </tbody>
    </table>
  )
}

export default ContentTable;