import { defineConfig } from 'vite';
import Path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        Homepage: Path.resolve(__dirname, 'public/Homepage.html'),
        DAORegistration: Path.resolve(__dirname, 'public/DAORegistration.html'),
        DAOProfile: Path.resolve(__dirname, 'public/DAOProfile.html'),
        JoinPlatform: Path.resolve(__dirname, 'public/JoinPlatform.html'),
        Owner: Path.resolve(__dirname, 'public/Owner.html'),
        Funder: Path.resolve(__dirname, 'public/Funder.html'),
        CreateProposal: Path.resolve(__dirname, 'public/CreateProposal.html'),
        ViewProposal: Path.resolve(__dirname, 'public/ViewProposal.html'),
        JifunzeElimu: Path.resolve(__dirname, 'public/JifunzeElimu.html'),
        
      },
    },
  },
  server: {
    port: 9000,
    open: '/Homepage.html', // Open the root URL
  },
});
