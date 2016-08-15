using System;
using EloBuddy;
using EloBuddy.SDK.Events;

namespace RaINAIO
{
    internal class Program
    {
        // ReSharper disable once UnusedParameter.Local
        /// <summary>
        /// The firs thing that runs on RaIN AIO
        /// </summary>
        /// <param name="args"></param>
        private static void Main(string[] args)
        {
            Loading.OnLoadingComplete += Loading_OnLoadingComplete;
        }

        /// <summary>
        /// This event is triggered when the game loads
        /// </summary>
        /// <param name="args"></param>
        private static void Loading_OnLoadingComplete(EventArgs args)
        {
            //Draven
            if (Player.Instance.Hero == Champion.Draven)
            {
                DravenSpellsManager.InitializeSpells();
                DravenMenus.CreateMenu();
                DravenDrawingsManager.InitializeDrawings();
            }
            //Teemo
            if (Player.Instance.Hero == Champion.Teemo)
            {
                TeemoSpellsManager.InitializeSpells();
                TeemoMenus.CreateMenu();
                TeemoDrawingsManager.InitializeDrawings();
            }
            //Rengar
            if (Player.Instance.Hero == Champion.Rengar)
            {
                RengarSpellsManager.InitializeSpells();
                RengarMenus.CreateMenu();
                RengarDrawingsManager.InitializeDrawings();
            }
            //Shaco
            if (Player.Instance.Hero == Champion.Shaco)
            {
                ShacoSpellsManager.InitializeSpells();
                ShacoMenus.CreateMenu();
                ShacoDrawingsManager.InitializeDrawings();
            }
        }
    }
}