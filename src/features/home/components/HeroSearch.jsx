import { useNavigate } from 'react-router-dom';
import GlobalSearch from '../../../components/common/GlobalSearch.jsx';

function HeroSearch() {
  const navigate = useNavigate();

  const handleSearch = (data) => {
    const { query, category } = data;
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (category && category !== 'all') {
      // Map frontend category to backend programCategory
      const catMap = {
        'language': 'Language',
        'bachelor': 'Bachelor',
        'master': 'Master',
        'phd': 'PhD'
      };
      params.append('programCategory', catMap[category] || category);
    }
    
    navigate(`/scholarships?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <GlobalSearch 
        placeholder="Major, university or city..."
        onSearch={handleSearch}
      />
    </div>
  );
}


export default HeroSearch;
